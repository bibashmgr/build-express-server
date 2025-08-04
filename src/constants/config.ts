import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const envVarsSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]),
  PORT: z.coerce.number(),
  MONGODB_URL: z.string(),
  RATE_LIMIT_INTERVAL_MINUTES: z.coerce.number(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number(),
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number(),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number(),
  OTP_VERIFY_ACCOUNT_EXPIRATION_MINUTES: z.coerce.number(),
  OTP_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number(),
  SMTP_HOST: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USERNAME: z.string(),
  EMAIL_FROM: z.string(),
});

const { data: envVars, error, success } = envVarsSchema.safeParse(process.env);

if (!success) {
  throw new Error(`Config validation error: ${String(error)}`);
}

export const config = {
  email: {
    from: envVars.EMAIL_FROM,
    smtp: {
      auth: {
        pass: envVars.SMTP_PASSWORD,
        user: envVars.SMTP_USERNAME,
      },
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
    },
  },
  env: envVars.NODE_ENV,
  rateLimit: {
    intervalMinutes: envVars.RATE_LIMIT_INTERVAL_MINUTES,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },
  jwt: {
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    secret: envVars.JWT_SECRET,
  },
  mongoose: {
    options: {},
    url: envVars.MONGODB_URL,
  },
  otp: {
    resetPasswordExpirationMinutes:
      envVars.OTP_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyAccountExpirationMinutes:
      envVars.OTP_VERIFY_ACCOUNT_EXPIRATION_MINUTES,
  },
  port: envVars.PORT,
};
