const crypto = require('crypto');
const User = require('../models/User');

// --- Razorpay setup ---------------------------------------------------------
// Guarded: if no real test keys are configured, `razorpay` stays null and the
// endpoints return a clear 503 instead of crashing.
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const isConfigured =
  keyId && keySecret &&
  !keyId.includes('your_') && !keySecret.includes('your_') &&
  keyId.startsWith('rzp_');
const razorpay = isConfigured
  ? new (require('razorpay'))({ key_id: keyId, key_secret: keySecret })
  : null;

const CURRENCY = 'INR'; // Razorpay (India) — amounts are in paise.

// Prices live on the SERVER (in rupees). The client only names a plan + billing
// period; we look up the real amount so it can't be tampered with.
const PLANS = {
  pro: { name: 'Pro', monthly: 999, yearly: 9999 },
  enterprise: { name: 'Enterprise', monthly: 2999, yearly: 29999 },
};

// @desc    Tell the frontend whether payments are live + the public key id
// @route   GET /api/payments/config
exports.getConfig = (req, res) => {
  res.status(200).json({
    success: true,
    enabled: !!razorpay,
    currency: CURRENCY,
    keyId: razorpay ? keyId : '',
  });
};

// @desc    Create a Razorpay order for a plan
// @route   POST /api/payments/create-order  (protected)
exports.createOrder = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payments are not configured. Add Razorpay test keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) to backend/.env.',
      });
    }

    const { plan, billing } = req.body;
    const planDef = PLANS[plan];
    const period = billing === 'yearly' ? 'yearly' : 'monthly';
    if (!planDef) {
      return res.status(400).json({ success: false, message: 'Unknown plan.' });
    }

    const amount = planDef[period]; // rupees
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: CURRENCY,
      receipt: `rcpt_${req.user._id.toString().slice(-6)}_${Date.now()}`, // <= 40 chars (Razorpay limit)
      // notes are read back (server-side) at verify time to activate the right plan.
      notes: { userId: req.user._id.toString(), plan, billing: period },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan,
      billing: period,
      planName: planDef.name,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a Razorpay payment signature and activate the plan
// @route   POST /api/payments/verify  (protected)
exports.verifySession = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payments are not configured.' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields.' });
    }

    // Signature = HMAC_SHA256("order_id|payment_id", key_secret)
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    // Read plan/billing from the SERVER-created order (don't trust the client).
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (order.notes?.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This payment does not belong to you.' });
    }
    const plan = order.notes.plan;
    const billing = order.notes.billing;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscription: {
          plan,
          status: 'active',
          billing,
          activatedAt: new Date(),
          paymentId: razorpay_payment_id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
      plan,
      billing,
      amountTotal: order.amount, // paise
      currency: order.currency,
    });
  } catch (error) {
    next(error);
  }
};
