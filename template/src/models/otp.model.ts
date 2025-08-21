import mongoose from "mongoose";

import { IOtp, ITimestamps, OtpEnum } from "../types";

type IOtpModel = mongoose.Model<IOtp & ITimestamps>;

const otpSchema = new mongoose.Schema<IOtp>(
  {
    type: {
      type: String,
      enum: [OtpEnum.RESET_PASSWORD, OtpEnum.VERIFY_ACCOUNT],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "otps",
  }
);

const otpModel = mongoose.model<IOtp, IOtpModel>("OTP", otpSchema);

type HydratedOtp = mongoose.HydratedDocument<IOtp & ITimestamps>;

export { otpModel, type HydratedOtp };
