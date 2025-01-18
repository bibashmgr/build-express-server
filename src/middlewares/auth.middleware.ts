import express from "express";
import httpStatus from "http-status";
import passport from "passport";

import { roleRights } from "../constants/roles";
import ApiError from "../helpers/ApiError";
import { IUser } from "../models";

const verifyCallback =
  (
    req: express.Request,
    resolve: (value?: unknown) => void,
    reject: (reason: any) => void,
    requiredRights: string[]
  ) =>
  (err: any, user: IUser | null, info: any) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please Authenticate")
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Access Denied"));
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
