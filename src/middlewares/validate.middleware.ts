import express from "express";
import { ZodObject } from "zod";
import httpStatus from "http-status";

import { ApiError } from "../helpers/apiError";

// This middleware validates request data with given zod schema
export const validate =
  (schema: ZodObject) =>
  (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    const { data, error, success } = schema.safeParse(req);

    if (!success) {
      const errorMessage = error.issues
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, data);
    return next();
  };
