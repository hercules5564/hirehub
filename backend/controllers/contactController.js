const sendEmail = require('../utils/sendEmail');

// @desc    Receive a contact/support message and email it to support
// @route   POST /api/contact
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const support = process.env.SUPPORT_EMAIL || process.env.SMTP_EMAIL || 'hirhubsupport@gmail.com';
    const safe = (s) => String(s || '').replace(/[<>]/g, '');
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 12px">New contact message — HireHub</h2>
        <p><strong>From:</strong> ${safe(name)} &lt;${safe(email)}&gt;</p>
        <p><strong>Subject:</strong> ${safe(subject) || '(none)'}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:12px 0"/>
        <p>${safe(message).replace(/\n/g, '<br/>')}</p>
      </div>`;

    // Reply-to the sender so support can respond directly.
    const delivered = await sendEmail({
      to: support,
      subject: `[Contact] ${safe(subject) || 'New message'} — from ${safe(name)}`,
      html,
      replyTo: email,
    });

    // Always log, so a message is never lost even when SMTP is off.
    console.log(`📨 Contact message from ${name} <${email}> | subject="${subject || ''}" | delivered=${delivered}`);

    res.status(200).json({ success: true, delivered });
  } catch (error) { next(error); }
};
