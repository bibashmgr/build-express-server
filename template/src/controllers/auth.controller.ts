import express from "express";
import httpStatus from "http-status";

import { authService } from "../services";
import { catchAsync } from "../helpers/catchAsync";

const registerUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await authService.registerUser(req.body);
    res.status(httpStatus.CREATED).send({
      message: "User registered successfully",
    });
  }
);

const sendAccountVerificationCode = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await authService.sendAccountVerificationCode(req.body);
    res.status(httpStatus.OK).send({
      message: "Verification code sent successfully",
    });
  }
);

const verifyAccount = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await authService.verifyAccount(req.body);
    res.status(httpStatus.OK).send({
      message: "Account verified successfully",
    });
  }
);

const loginUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const result = await authService.loginUser(req.body);
    res.status(httpStatus.OK).send(result);
  }
);

const forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body);
  res.status(httpStatus.OK).send({
    message: "OPT code sent successfully",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(httpStatus.OK).send({
    message: "Reset password successfully",
  });
});

const refreshToken = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const tokens = await authService.refreshToken(req.body);
    res.status(httpStatus.OK).send(tokens);
  }
);

const logoutUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await authService.logoutUser(req.body);
    res.status(httpStatus.OK).send({
      message: "User logged out successfully",
    });
  }
);

export {
  registerUser,
  sendAccountVerificationCode,
  verifyAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
};
