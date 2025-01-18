import moment from "moment";
import nodemailer from "nodemailer";

import { config } from "../constants/config";
import { logger } from "../utils/logger";

const transport = nodemailer.createTransport(config.email.smtp);

transport
  .verify()
  .then(() => logger.info("Connected to email server"))
  .catch(() =>
    logger.warn(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

// This function returns html content
const generateHtmlContent = (
  title: string,
  code: number,
  expirationMins: number
) => {
  return `<body style="margin:0; font-family:'Poppins',sans-serif; background:#ffffff; font-size:14px;">
    <div style="max-width:680px; margin:0 auto; padding:45px 30px 60px; background:#4fd1c5; font-size:14px; color:#434343;"
    >
      <header>
        <table style="width:100%;">
          <tbody>
            <tr style="height:0;">
              <td>
                <h1 style="font-size:24px; color: #ffffff;">Logo</h1>
              </td>
              <td style="text-align:right;">
                <span style="font-size:16px; line-height:30px; color:#ffffff;">${moment().format(
                  "DD MMM, YYYY"
                )}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </header>
      <main>
        <div style="margin:0; margin-top:70px; padding:92px 30px 115px; background:#ffffff;border-radius:30px; text-align:center;">
          <div style="width:100%; max-width:489px; margin:0 auto;">
            <h1 style="margin:0; font-size:24px; font-weight:500; color:#1f1f1f; text-transform:capitalize;">
              ${title}
            </h1>
            <p style="margin:0; margin-top:17px; font-weight:500; letter-spacing:0.56px;">
              Use the following OTP to complete the procedure to ${title} for your account. OTP is valid for ${String(expirationMins)} minutes. Do not share this code with others.
            </p>
            <p style="margin:0; margin-top:60px; font-size:32px; font-weight:600; letter-spacing:25px; color:#319795;">
              ${String(code)}
            </p>
          </div>
        </div>
        <p style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #ffffff;">
          Need help? Ask at
          <a href="mailto:support.brand@gmail.com" style="color: #319795; text-decoration: none;">
            support.brand@gmail.com
          </a>
          or visit our
          <a href="https://yourbrand.com/help-center" target="_blank" style="color: #319795; text-decoration: none;">Help Center</a>
        </p>
      </main>
      <footer style=" width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">        
        <p style="margin: 0; margin-top: 16px; color: #ffffff;">
          Copyright © ${String(new Date().getFullYear())} Your Brand. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
  `;
};

// This function sends email to a paticular email account
const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = { from: config.email.from, html, subject, to };
  await transport.sendMail(msg);
};

// This function sends email for resetting password
export const sendResetPasswordEmail = async (to: string, code: number) => {
  const subject = "Reset Password";
  const html = generateHtmlContent(
    "reset password",
    code,
    config.otp.resetPasswordExpirationMinutes
  );

  await sendEmail(to, subject, html);
};

// This function sends email for verifying email
export const sendVerificationEmail = async (to: string, code: number) => {
  const subject = "Email Verification";
  const html = generateHtmlContent(
    "verify email",
    code,
    config.otp.verifyEmailExpirationMinutes
  );

  await sendEmail(to, subject, html);
};
