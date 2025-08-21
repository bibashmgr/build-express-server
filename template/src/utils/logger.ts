import winston from "winston";

import { config } from "../constants/config";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger: winston.Logger = winston.createLogger({
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(
      ({ level, message }) => `${level}: ${String(message)}`
    )
  ),
  level: config.env === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});
