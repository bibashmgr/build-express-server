import express from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import { config } from "../constants/config";
import ApiError from "../helpers/ApiError";
import { ResponseStatusEnum } from "../types/response.type";
import { logger } from "../utils/logger";

// This middlware converts Error into ApiError
export const errorConverter = (
  err: any,
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }

  next(error);
};

// This middleware formats ApiError into JSON
export const errorHandler = (
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  let { message, statusCode } = err;

  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    data: null,
    message,
    status: ResponseStatusEnum.FAILURE,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
