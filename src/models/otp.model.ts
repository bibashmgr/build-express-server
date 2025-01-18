import mongoose from "mongoose";

import { OtpEnum } from "../types/otp.type";

export interface IOtp extends mongoose.Document {
  code: number;
  expires: Date;
  type: OtpEnum;
  user: mongoose.Types.ObjectId;
}

const otpSchema = new mongoose.Schema<IOtp>({
  code: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [OtpEnum.RESET_PASSWORD, OtpEnum.VERIFY_EMAIL],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
