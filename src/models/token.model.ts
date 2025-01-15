import mongoose from "mongoose";

import { TokenEnum } from "../types/token.type";

export interface IToken extends mongoose.Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: TokenEnum;
  expires: Date;
  blacklisted: boolean;
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
