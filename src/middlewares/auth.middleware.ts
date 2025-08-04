import express from "express";
import passport from "passport";
import httpStatus from "http-status";

import { HydratedUser } from "../models";
import { ApiError } from "../helpers/apiError";
import { roleRights } from "../constants/roles";

const verifyCallback =
  (
    req: express.Request,
    resolve: (value?: unknown) => void,
    reject: (reason: any) => void,
    requiredRights: string[]
  ) =>
  (err: any, user: HydratedUser | null, info: any) => {
    if (err || info || !user) {
      const isTokenExpired = info?.message === "jwt expired";
      const message = isTokenExpired ? "Token expired" : "Please authenticate";
      const statusCode = httpStatus.UNAUTHORIZED;

      return reject(new ApiError(statusCode, message));
    }

    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Access denied"));
      }
    }

    resolve();
  };

export const authenticate =
  (...requiredRights: string[]) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err: unknown) => next(err));
  };
