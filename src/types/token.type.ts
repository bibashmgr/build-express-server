import mongoose from "mongoose";

export enum TokenEnum {
  ACCESS = "access",
  REFRESH = "refresh",
}

export interface IToken {
  expires: Date;
  token: string;
  type: TokenEnum;
  user: mongoose.Types.ObjectId;
}
