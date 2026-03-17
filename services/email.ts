import nodemailer from "nodemailer";
export class EmailService {
  private mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  async sendVerificationEmail(to: string, code: string) {
    try {
      await this.mailTransporter.sendMail({
        from: `"Ecommerce App" <${process.env.GMAIL_USER}>`,
        to: "brk2v.test@inbox.testmail.app",
        subject: "Verify your email",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Email Verification</h1>
              <p>Your verification code is:</p>
              <h2 style="letter-spacing: 5px;">${code}</h2>
              <p>Or click the button below to verify your email:</p>

              <!-- button is just a styled link -->
              <a href="${"localhost"}/verify-email?code=${code}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #000;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                ">
                Verify Email
              </a>

              <p>This code expires in <strong>15 minutes</strong>.</p>
              <p>If you did not register, please ignore this email.</p>
            </div>
      `,
      });
    } catch (err: any) {
      throw err;
    }
  }
  async sendResetPasswordEmail(to: string, code: string) {
    try {
      await this.mailTransporter.sendMail({
        from: `"Ecommerce App" <${process.env.GMAIL_USER}>`,
        to: "brk2v.test@inbox.testmail.app",
        subject: "Verify your email",
        html: resetPasswordTemplate(code),
      });
    } catch (err: any) {
      throw err;
    }
  }
}

export const resetPasswordTemplate = (code: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
">

  <div style="
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  ">

    <!-- header -->
    <div style="
      background-color: #000000;
      padding: 30px;
      text-align: center;
    ">
      <h1 style="
        color: #ffffff;
        margin: 0;
        font-size: 24px;
      ">Password Reset</h1>
    </div>

    <!-- body -->
    <div style="padding: 40px 30px;">

      <p style="color: #333; font-size: 16px;">
        We received a request to reset your password. Use the code below:
      </p>

      <!-- code box -->
      <div style="
        background-color: #f4f4f4;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
      ">
        <p style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 10px;
          color: #000000;
          margin: 0;
        ">${code}</p>
      </div>

      <p style="color: #666; font-size: 14px;">
        This code expires in <strong>15 minutes</strong>.
      </p>

      <!-- button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${"localhost"}/reset-password?code=${code}"
          style="
            display: inline-block;
            padding: 14px 32px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
          ">
          Reset Password
        </a>
      </div>

      <!-- warning -->
      <div style="
        border-left: 4px solid #ff4444;
        padding: 12px 16px;
        background-color: #fff5f5;
        border-radius: 0 6px 6px 0;
        margin-top: 20px;
      ">
        <p style="color: #ff4444; margin: 0; font-size: 14px;">
          ⚠️ If you did not request a password reset, please ignore this email.
          Your password will remain unchanged.
        </p>
      </div>

    </div>

    <!-- footer -->
    <div style="
      background-color: #f4f4f4;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    ">
      <p style="color: #999; font-size: 12px; margin: 0;">
        This email was sent by Ecommerce App.
        If you have any questions, contact us at
        <a href="mailto:support@yourapp.com" style="color: #000;">
          support@yourapp.com
        </a>
      </p>
    </div>

  </div>

</body>
</html>
`;
