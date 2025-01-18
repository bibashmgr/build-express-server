import express from "express";
import httpStatus from "http-status";
import { ZodSchema } from "zod";

import ApiError from "../helpers/ApiError";

// This middleware validates request body with given schema
export const validate =
  (schema: ZodSchema) =>
  (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    const { success, error, data } = schema.safeParse(req);

    if (!success) {
      const errorMessage = error.issues
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, data);
    return next();
  };
