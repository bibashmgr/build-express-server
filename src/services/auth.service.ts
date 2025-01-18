import httpStatus from "http-status";

import ApiError from "../helpers/ApiError";
import { IUser, OTP, Token } from "../models";
import { OtpEnum } from "../types/otp.type";
import { TokenEnum } from "../types/token.type";
import * as otpService from "./otp.service";
import * as tokenService from "./token.service";
import * as userService from "./user.service";

// This function logins user by email & password
export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect Credentials");
  }
  return user;
};

// This functions logouts user from the system
export const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({
    blacklisted: false,
    token: refreshToken,
    type: TokenEnum.REFRESH,
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token Not Found");
  }

  await refreshTokenDoc.deleteOne();
};

// This function removes and generates a new refresh token
export const refreshAuth = async (refreshToken: string) => {
  const refreshTokenDoc = await tokenService.verifyToken(
    refreshToken,
    TokenEnum.REFRESH
  );
  const user = await userService.getUserById(refreshTokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Token");
  }
  await refreshTokenDoc.deleteOne();
  return tokenService.generateAuthTokens(user);
};

export const resetPassword = async (
  email: string,
  resetPasswordOtp: number,
  newPassword: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const resetPasswordOtpDoc = await otpService.verifyOtp(
    user.id,
    resetPasswordOtp,
    OtpEnum.RESET_PASSWORD
  );

  await userService.updateUserById(resetPasswordOtpDoc.user, {
    password: newPassword,
  });
  await OTP.deleteMany({
    type: OtpEnum.RESET_PASSWORD,
    user: resetPasswordOtpDoc.user,
  });
  await Token.deleteMany({
    type: TokenEnum.REFRESH,
    user: resetPasswordOtpDoc.user,
  });
};

export const verifyEmail = async (user: IUser, verifyEmailOtp: number) => {
  const verifyEmailOtpDoc = await otpService.verifyOtp(
    user.id,
    verifyEmailOtp,
    OtpEnum.VERIFY_EMAIL
  );

  await userService.updateUserById(user.id, { isEmailVerified: true });
  await OTP.deleteMany({
    type: OtpEnum.VERIFY_EMAIL,
    user: verifyEmailOtpDoc.user,
  });
};
