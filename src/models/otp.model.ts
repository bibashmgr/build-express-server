import mongoose from "mongoose";

// constants
import { otpTypes } from "../constants/schemas";

export interface IOtp extends mongoose.Document {
  code: number;
  user: mongoose.Types.ObjectId;
  type: otpTypes;
  expires: Date;
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
    enum: [otpTypes.RESET_PASSWORD, otpTypes.VERIFY_EMAIL],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
