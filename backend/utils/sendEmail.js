const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"HireHub" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
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
