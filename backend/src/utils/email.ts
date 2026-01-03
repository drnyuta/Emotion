import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetUrl: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || "Your App"}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #4F46E5; word-break: break-all;">${resetUrl}</p>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #666; font-size: 12px;">
            This is an automated message from ${process.env.APP_NAME || "Your App"}. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (
  toEmail: string,
): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || "Your App"}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Welcome to ${process.env.APP_NAME || "Your App"}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${process.env.APP_NAME || "Your App"}! 🎉</h2>
          
          <p>Hi,</p>
          
          <p>Thank you for creating an account! We're excited to have you on board.</p>
          
          <p>Get started by logging in and exploring all the features we have to offer.</p>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Best regards,<br>The ${process.env.APP_NAME || "Your App"} Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error: any) {
    console.error("Failed to send welcome email:", error);
  }
};