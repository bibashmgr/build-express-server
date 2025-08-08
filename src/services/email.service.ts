import path from "path";
import { readFileSync } from "fs";
import { format } from "date-fns";
import Mail, { Address } from "nodemailer/lib/mailer";

import { logger } from "../utils/logger";
import { EmailTypeEnum } from "../types";
import Handlebars from "../utils/hadlebars";
import { config } from "../constants/config";
import { transport } from "../utils/nodemailer";

// This function returns an email template based on the specified email type and context.
function getEmailTemplate(type: EmailTypeEnum, context: any = {}) {
  let source = "";

  switch (type) {
    case EmailTypeEnum.ACCOUNT_VERIFICATION_EMAIL:
      source = readFileSync(
        path.join(__dirname, "../templates/accountVerification.template.html"),
        "utf-8"
      );
      break;

    case EmailTypeEnum.RESET_PASSWORD_EMAIL:
      source = readFileSync(
        path.join(__dirname, "../templates/resetPassword.template.html"),
        "utf-8"
      );
      break;
  }

  const template = Handlebars.compile(source);
  return template(context, {
    allowProtoPropertiesByDefault: true,
  });
}

// This function sends an email with the specified sender, recipients, subject, and HTML content
async function sendEmail(
  from: string | Address,
  to: string | Address | string[] | Address[],
  subject: string,
  html: string
) {
  const options: Mail.Options = { from, html, subject, to };
  await transport.sendMail(options);
}

// This function sends email for verifying email
async function sendAccountVerificationEmail(to: string, code: string) {
  try {
    const from = {
      name: "Your App",
      address: config.email.from,
    };
    const subject = "Account Verification";
    const html = getEmailTemplate(EmailTypeEnum.ACCOUNT_VERIFICATION_EMAIL, {
      code,
      expirationMinutes: config.otp.verifyAccountExpirationMinutes,
    });
    await sendEmail(from, to, subject, html);
  } catch (error: unknown) {
    logger.error(error);
  }
}

// This function sends email for resetting password
async function sendResetPasswordEmail(to: string, code: string) {
  try {
    const from = {
      name: "Your App",
      address: config.email.from,
    };
    const subject = "Reset Password";
    const html = getEmailTemplate(EmailTypeEnum.RESET_PASSWORD_EMAIL, {
      code,
      expirationMinutes: config.otp.resetPasswordExpirationMinutes,
      date: format(new Date(), "dd MMM, yyyy"),
      year: format(new Date(), "yyyy"),
    });
    await sendEmail(from, to, subject, html);
  } catch (error: unknown) {
    logger.error(error);
  }
}

export { sendAccountVerificationEmail, sendResetPasswordEmail };
