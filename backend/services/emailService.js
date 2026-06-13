const sendEmail = require('../utils/sendEmail');

class EmailService {
  static async sendVerificationEmail(user, token) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f9fafb; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 28px;">HireHub</h1>
            <p style="color: #6b7280; margin-top: 5px;">Your Career, Your Future</p>
          </div>
          <h2 style="color: #1f2937; margin-bottom: 16px;">Verify Your Email</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #4b5563; line-height: 1.6;">Thank you for joining HireHub! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
        </div>
      </div>`;

    await sendEmail({
      to: user.email,
      subject: 'HireHub - Verify Your Email Address',
      html,
    });
  }

  static async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f9fafb; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 28px;">HireHub</h1>
          </div>
          <h2 style="color: #1f2937; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link expires in 30 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </div>`;

    await sendEmail({
      to: user.email,
      subject: 'HireHub - Password Reset Request',
      html,
    });
  }

  static async sendApplicationStatusEmail(user, jobTitle, status) {
    const statusMessages = {
      shortlisted: 'Congratulations! You have been shortlisted.',
      interview: 'You have been scheduled for an interview.',
      offered: 'Congratulations! You have received a job offer!',
      rejected: 'Unfortunately, your application was not selected at this time.',
    };

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f9fafb; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 28px;">HireHub</h1>
          </div>
          <h2 style="color: #1f2937;">Application Update</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #4b5563; line-height: 1.6;">Your application for <strong>${jobTitle}</strong> has been updated:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="color: #6366f1; font-weight: 600; font-size: 18px; margin: 0;">${statusMessages[status] || `Status: ${status}`}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/applications" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">View Application</a>
          </div>
        </div>
      </div>`;

    await sendEmail({
      to: user.email,
      subject: `HireHub - Application Update: ${jobTitle}`,
      html,
    });
  }
}

module.exports = EmailService;
