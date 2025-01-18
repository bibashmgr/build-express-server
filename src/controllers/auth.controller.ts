import express from "express";
import httpStatus from "http-status";

import catchAsync from "../helpers/catchAsync";
import successHandler from "../helpers/successHandler";
import { IUser } from "../models";
import {
  authService,
  emailService,
  otpService,
  tokenService,
  userService,
} from "../services";

export const register = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res
      .status(httpStatus.CREATED)
      .send(successHandler({ tokens, user }, "User Register Successfully"));
  }
);

export const login = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res
      .status(httpStatus.OK)
      .send(successHandler({ tokens, user }, "Login Successful"));
  }
);

export const logout = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.OK).send(successHandler(null, "Logout Successful"));
  }
);

export const refreshTokens = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res
      .status(httpStatus.OK)
      .send(successHandler({ ...tokens }, "Refresh Token Successful"));
  }
);

export const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordOtp = await otpService.generateResetPasswordOtp(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordOtp);
  res.status(httpStatus.OK).send(successHandler(null, "Send OTP Code"));
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(
    req.body.email,
    Number(req.query.otp),
    req.body.password
  );
  res
    .status(httpStatus.OK)
    .send(successHandler(null, "Reset Password Successfully"));
});

export const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailOtp = await otpService.generateVerifyEmailOtp(
    req.user as IUser
  );
  await emailService.sendVerificationEmail(
    (req.user as IUser).email,
    verifyEmailOtp
  );
  res.status(httpStatus.OK).send(successHandler(null, "Send OTP Code"));
});

export const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.user as IUser, Number(req.query.otp));
  res.status(httpStatus.OK).send(successHandler(null, "Email Verified"));
});
