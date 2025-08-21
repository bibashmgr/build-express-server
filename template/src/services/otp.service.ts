import httpStatus from "http-status";
import otpGenerator from "otp-generator";
import { addMinutes, isBefore } from "date-fns";

import { OtpEnum } from "../types";
import { otpModel } from "../models";
import { config } from "../constants/config";
import { ApiError } from "../helpers/apiError";

// This function generates a particular type of otp
function generateOtp(): string {
  const otpCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
  return otpCode;
}

// This function saves the generated otp in database
async function saveOtp(
  code: string,
  userId: string,
  type: string,
  expires: Date
) {
  const otpDoc = await otpModel.create({
    code,
    expires,
    type,
    user: userId,
  });
  return otpDoc;
}

// This function generate otp for verifying account
async function generateVerifyAccountOtp(userId: string) {
  const expires = addMinutes(
    new Date(),
    config.otp.verifyAccountExpirationMinutes
  );
  const verifyEmailOtp = generateOtp();

  return await saveOtp(verifyEmailOtp, userId, OtpEnum.VERIFY_ACCOUNT, expires);
}

// This function generate otp for resetting password
async function generateResetPasswordOtp(userId: string) {
  const expires = addMinutes(
    new Date(),
    config.otp.resetPasswordExpirationMinutes
  );
  const resetPasswordOtp = generateOtp();

  return await saveOtp(
    resetPasswordOtp,
    userId,
    OtpEnum.RESET_PASSWORD,
    expires
  );
}

// This function verifies whether the otp is valid or not
async function verifyOtp(userId: string, code: string, type: OtpEnum) {
  const optDocs = await otpModel
    .find({
      user: userId,
      type,
    })
    .sort({ createdAt: -1 })
    .limit(1);

  if (optDocs.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP not found");
  }

  const otpDoc = optDocs[0];

  if (otpDoc.code !== code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (!isBefore(new Date(), otpDoc.expires)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP already expired");
  }

  return otpDoc;
}

// This function delete all the otps associated with the given userId
async function deleteOtpsByUserId(userId: string, type: OtpEnum) {
  return await otpModel.deleteMany({
    type,
    user: userId,
  });
}

export {
  generateVerifyAccountOtp,
  generateResetPasswordOtp,
  verifyOtp,
  deleteOtpsByUserId,
};
