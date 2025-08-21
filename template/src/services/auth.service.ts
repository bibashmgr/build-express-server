import httpStatus from "http-status";

import * as otpService from "./otp.service";
import * as userService from "./user.service";
import { OtpEnum, TokenEnum } from "../types";
import { ApiError } from "../helpers/apiError";
import { authValidation } from "../validations";
import * as tokenService from "./token.service";
import * as emailService from "./email.service";

// This function register a new user and send verify account verification email to the user's email
async function registerUser(
  payload: authValidation.RegisterUserRequest["body"]
) {
  const user = await userService.createUser(payload);
  const optDoc = await otpService.generateVerifyAccountOtp(user.id);
  await emailService.sendAccountVerificationEmail(user.email, optDoc.code);
  return null;
}

// This function generates a verify account OTP for the user identified by email
async function sendAccountVerificationCode(
  payload: authValidation.SendAccountVerificationCodeRequest["body"]
) {
  const user = await userService.getUserByEmail(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email");
  }

  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Account already verified");
  }

  const optDoc = await otpService.generateVerifyAccountOtp(user.id);
  await emailService.sendAccountVerificationEmail(user.email, optDoc.code);
  return null;
}

// This fucntion verifies the user’s account by validating the OTP code
async function verifyAccount(
  payload: authValidation.VerifyAccountRequest["body"]
) {
  const user = await userService.getUserByEmail(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Account already verified");
  }

  await otpService.verifyOtp(user.id, payload.code, OtpEnum.VERIFY_ACCOUNT);
  await Promise.all([
    userService.updateUserById(user.id, { isEmailVerified: true }),
    otpService.deleteOtpsByUserId(user.id, OtpEnum.VERIFY_ACCOUNT),
  ]);
  return null;
}

// This function logins user by email & password
async function loginUser(payload: authValidation.LoginUserRequest["body"]) {
  const user = await userService.getUserByEmail(payload.email);

  if (!user || !(await user.isPasswordMatch(payload.password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect credentials");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Account not verified");
  }

  const tokens = await tokenService.generateAuthTokens(user.id);
  return {
    account: user,
    tokens,
  };
}

// This function generates a reset password OTP for the user identified by email
async function forgotPassword(
  payload: authValidation.ForgotPasswordRequest["body"]
) {
  const user = await userService.getUserByEmail(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  const otpDoc = await otpService.generateResetPasswordOtp(user.id);
  await emailService.sendResetPasswordEmail(user.email, otpDoc.code);
  return null;
}

// This function verifies the reset password OTP for the user’s email & updates the user’s password
async function resetPassword(
  payload: authValidation.ResetPasswordRequest["body"]
) {
  const user = await userService.getUserByEmail(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  await otpService.verifyOtp(user.id, payload.code, OtpEnum.RESET_PASSWORD);
  await Promise.all([
    userService.updateUserById(user.id, {
      password: payload.password,
    }),
    otpService.deleteOtpsByUserId(user.id, OtpEnum.RESET_PASSWORD),
    tokenService.deleteTokensByUserId(user.id, TokenEnum.REFRESH),
  ]);
  return null;
}

// This function removes and generates a new refresh token
async function refreshToken(
  payload: authValidation.RefreshTokenRequest["body"]
) {
  const refreshTokenDoc = await tokenService.verifyToken(
    payload.refreshToken,
    TokenEnum.REFRESH
  );
  const user = await userService.getUserById(refreshTokenDoc.user.toString());

  if (!user) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "No user found for the provided token"
    );
  }

  await refreshTokenDoc.deleteOne();
  return await tokenService.generateAuthTokens(user.id);
}

// This functions logouts user from the system
async function logoutUser(payload: authValidation.LogoutUserRequest["body"]) {
  const refreshTokenDoc = await tokenService.verifyToken(
    payload.refreshToken,
    TokenEnum.REFRESH
  );

  const user = await userService.getUserById(refreshTokenDoc.user.toString());

  if (!user) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "No user found for the provided token"
    );
  }

  return await refreshTokenDoc.deleteOne();
}

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
