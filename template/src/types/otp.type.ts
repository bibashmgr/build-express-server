import mongoose from "mongoose";

export enum OtpEnum {
  RESET_PASSWORD = "reset_password",
  VERIFY_ACCOUNT = "verify_account",
}

export interface IOtp {
  code: string;
  expires: Date;
  type: OtpEnum;
  user: mongoose.Types.ObjectId;
}
