import nodemailer from "nodemailer";

import { logger } from "./logger";
import { config } from "../constants/config";

const transport = nodemailer.createTransport(config.email.smtp);

transport
  .verify()
  .then(() => logger.info("Connected to email server"))
  .catch(() =>
    logger.error(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

export { transport };
