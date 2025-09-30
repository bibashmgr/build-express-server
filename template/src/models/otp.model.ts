import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { IOtp, ITimestamps, OtpEnum } from "../types";

interface IOtpMethods {
  isCodeMatch(code: string): Promise<boolean>;
}

type IOtpModel = mongoose.Model<IOtp & ITimestamps, unknown, IOtpMethods>;

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

otpSchema.method("isCodeMatch", async function isCodeMatch(password: string) {
  return bcrypt.compare(password, this.code);
});

otpSchema.pre("save", async function (next) {
  if (this.isModified("code")) {
    this.code = await bcrypt.hash(this.code, 8);
  }
  next();
});

const otpModel = mongoose.model<IOtp, IOtpModel>("OTP", otpSchema);

type HydratedOtp = mongoose.HydratedDocument<IOtp & ITimestamps>;

export { otpModel, type HydratedOtp };
