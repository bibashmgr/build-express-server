import mongoose from "mongoose";

export enum TokenEnum {
  ACCESS = "access",
  REFRESH = "refresh",
}

export interface IToken {
  type: TokenEnum;
  token: string;
  user: mongoose.Types.ObjectId;
  expires: Date;
  blacklisted: boolean;
}
