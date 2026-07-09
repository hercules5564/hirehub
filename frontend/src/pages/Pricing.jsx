import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineCheck } from 'react-icons/hi';
import { createPaymentOrderAPI, verifyPaymentAPI } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';

// Loads Razorpay's checkout.js on demand (the modal needs window.Razorpay).
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

// HireHub plans. Pro highlights the premium features promoted in the navbar:
// AI Job Matching and the Resume Builder.
const plans = [
  {
    name: 'Starter',
    description: 'Everything you need to kick off your job search — free, forever.',
    price: 0,
    yearlyPrice: 0,
    buttonText: 'Get started',
    buttonVariant: 'outline',
    planKey: 'free',
    includes: [
      'Free includes:',
      'Browse all jobs',
      'Apply to 10 jobs / month',
      'Basic resume builder',
      'Email job alerts',
    ],
  },
  {
    name: 'Pro',
    description: 'For serious candidates who want an AI edge in their search.',
    price: 999,
    yearlyPrice: 9999,
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default',
    popular: true,
    planKey: 'pro',
    includes: [
      'Everything in Starter, plus:',
      'AI Job Matching & auto-apply',
      'Full Resume Builder + templates',
      'AI resume ATS scoring',
      'Priority in recruiter search',
      'Advanced analytics',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Advanced security and unlimited access for teams hiring at scale.',
    price: 2999,
    yearlyPrice: 29999,
    buttonText: 'Get Enterprise',
    buttonVariant: 'outline',
    planKey: 'enterprise',
    includes: [
      'Everything in Pro, plus:',
      'Unlimited job postings',
      'Team & role management',
      'Branded company page',
      'Dedicated account manager',
    ],
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSelect = async (plan) => {
    // Free plan → straight to sign up / dashboard, no payment.
    if (plan.planKey === 'free') {
      navigate(isAuthenticated ? '/dashboard' : '/signup');
      return;
    }
    // Paid plans need an account so the purchase ties to the user.
    if (!isAuthenticated) {
      toast('Please log in to upgrade', { icon: '🔒' });
      navigate('/login');
      return;
    }
    try {
      setLoadingPlan(plan.planKey);
      const ok = await loadRazorpay();
      if (!ok) {
        toast.error('Could not load Razorpay. Check your connection.');
        setLoadingPlan(null);
        return;
      }
      const billing = isYearly ? 'yearly' : 'monthly';
      const { data } = await createPaymentOrderAPI({ plan: plan.planKey, billing });

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'HireHub',
        description: `${data.planName} plan · ${billing}`,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#2457e6' },
        handler: async (response) => {
          // response: razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            const res = await verifyPaymentAPI(response);
            if (res.data.user) dispatch(updateUser(res.data.user));
            navigate('/payment-success', { state: res.data });
          } catch (e) {
            toast.error(e.response?.data?.message || 'Payment verification failed.');
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: { ondismiss: () => setLoadingPlan(null) },
      });
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start payment. Try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300">
      {/* ===== Hero ===== */}
      <section className="bg-ink-50 dark:bg-[#11161f] border-b border-ink-200 dark:border-[#262c36]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 dark:text-white text-balance leading-[1.1]">
            Plans that work best for your hiring
          </h1>
          <p className="mt-5 text-lg text-ink-600 dark:text-ink-400 max-w-xl mx-auto text-balance">
            Trusted by thousands of job-seekers and recruiters. Explore which option is right for you.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-ink-200 dark:border-[#262c36] bg-white dark:bg-[#161b22] p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${!isYearly ? 'bg-primary-600 text-white' : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${isYearly ? 'bg-primary-600 text-white' : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'}`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Plans ===== */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl p-6 bg-white dark:bg-[#161b22] ${plan.popular
                  ? 'border border-primary-500 ring-1 ring-primary-500 shadow-soft'
                  : 'border border-ink-200 dark:border-[#262c36]'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-md bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-ink-900 dark:text-white">
                    ₹{(isYearly ? plan.yearlyPrice : plan.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-ink-500 dark:text-ink-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
                <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">{plan.description}</p>

                <button
                  onClick={() => handleSelect(plan)}
                  disabled={loadingPlan === plan.planKey}
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04]'}`}
                >
                  {loadingPlan === plan.planKey ? 'Processing…' : plan.buttonText}
                </button>

                <div className="mt-6 pt-6 border-t border-ink-200 dark:border-[#262c36]">
                  <h4 className="text-sm font-semibold text-ink-900 dark:text-white mb-3">{plan.includes[0]}</h4>
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-400">
                        <HiOutlineCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
