import mongoose from "mongoose";

import { TokenEnum } from "../types/token.type";

export interface IToken extends mongoose.Document {
  blacklisted: boolean;
  expires: Date;
  token: string;
  type: TokenEnum;
  user: mongoose.Types.ObjectId;
}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [TokenEnum.REFRESH],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model<IToken>("Token", tokenSchema);
