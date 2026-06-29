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

    // Log immediately so the message is never lost (e.g. if the host blocks SMTP).
    console.log(`📨 Contact message from ${name} <${email}> | subject="${subject || ''}"`);

    // Respond right away — never make the user wait on the mail server. Some hosts
    // (Render free tier) block outbound SMTP, which would otherwise hang forever.
    res.status(200).json({ success: true });

    // Fire-and-forget the email in the background (bounded by sendEmail's timeouts).
    sendEmail({
      to: support,
      subject: `[Contact] ${safe(subject) || 'New message'} — from ${safe(name)}`,
      html,
      replyTo: email,
    })
      .then((delivered) => console.log(`   ↳ contact email delivered=${delivered}`))
      .catch((err) => console.error('   ↳ contact email error:', err.message));
  } catch (error) { next(error); }
};
