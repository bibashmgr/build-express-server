import express from "express";
import { ZodObject } from "zod";
import httpStatus from "http-status";

import { ApiError } from "../helpers/apiError";

// This middleware validates request data with given zod schema
function validate(schema: ZodObject) {
  return (
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

    if ("body" in data) {
      req.body = data.body;
    }

    if ("params" in data) {
      req.params = data.params as any;
    }

    if ("query" in data) {
      Object.defineProperty(req, "query", {
        value: data.query,
        writable: false,
        configurable: true,
        enumerable: true,
      });
    }

    return next();
  };
}

export { validate };
