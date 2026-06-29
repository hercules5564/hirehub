const nodemailer = require('nodemailer');

const isConfigured = () => {
  const { SMTP_HOST, SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  return SMTP_HOST && SMTP_EMAIL && SMTP_PASSWORD &&
    !SMTP_EMAIL.includes('your_') && !SMTP_PASSWORD.includes('your_');
};

const sendEmail = async ({ to, subject, html, replyTo }) => {
  // Skip silently (but log) when SMTP isn't set up, so flows like registration
  // don't fail just because email isn't configured yet.
  if (!isConfigured()) {
    console.warn(`⚠️  SMTP not configured — skipped email "${subject}" to ${to}`);
    return false;
  }
  try {
    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // Fail fast instead of hanging forever if the host blocks outbound SMTP
      // (common on free PaaS tiers like Render).
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: `"HireHub" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return false;
  }
};

module.exports = sendEmail;
