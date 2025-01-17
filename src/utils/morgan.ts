import express from "express";
import morgan from "morgan";

import { logger } from "./logger";
import { config } from "../constants/config";

morgan.token("message", (req: express.Request, res: express.Response) => {
  return res.locals.errorMessage || "";
});

const getIpFormat = () =>
  config.env === "production" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const morganHandler = {
  errorHandler,
  successHandler,
};
