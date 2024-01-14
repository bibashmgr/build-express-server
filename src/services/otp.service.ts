import moment from "moment";
import mongoose from "mongoose";
import httpStatus from "http-status";
import * as otpGenerator from "otp-generator";

// helpers
import ApiError from "../helpers/ApiError";

// services
import * as userService from "./user.service";

// constants
import { config } from "../constants/config";
import { otpTypes } from "../constants/schemas";

// models
import { IUser, OTP } from "../models";

// This function generates OTP code
const generateOtp = (): number => {
  const otpCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return Number(otpCode);
};

// This function saves the generated OTP code
const saveOtp = async (
  code: number,
  userId: mongoose.Types.ObjectId,
  type: string,
  expires: moment.Moment
) => {
  const tokenDoc = await OTP.create({
    code,
    user: userId,
    type,
    expires: expires.toDate(),
  });
  return tokenDoc;
};

// This function verifies whether the otp is valid or not
export const verifyOtp = async (
  userId: mongoose.Types.ObjectId,
  code: number,
  type: otpTypes
) => {
  const otpDoc = await OTP.findOne({
    user: userId,
    code,
    type,
  });
  if (!otpDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid OTP");
  }

  if (!moment.utc().isSameOrBefore(otpDoc.expires)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP Already Expired");
  }

  return otpDoc;
};

// This function generates otp code to reset password
export const generateResetPasswordOtp = async (email: string) => {
  const user: IUser | null = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const expires = moment().add(
    config.otp.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordOtp = generateOtp();
  await saveOtp(resetPasswordOtp, user._id, otpTypes.RESET_PASSWORD, expires);

  return resetPasswordOtp;
};

// This function generates otp code to verify email
export const generateVerifyEmailOtp = async (user: IUser) => {
  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email Already Verified");
  }

  const expires = moment().add(
    config.otp.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailOtp = generateOtp();
  await saveOtp(verifyEmailOtp, user._id, otpTypes.VERIFY_EMAIL, expires);

  return verifyEmailOtp;
};
