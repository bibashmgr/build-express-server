import mongoose from "mongoose";

import { ITimestamps, IToken, TokenEnum } from "../types";

export interface ITokenModel extends mongoose.Model<IToken & ITimestamps> {}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    type: {
      type: String,
      enum: [TokenEnum.REFRESH],
      required: true,
    },
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
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "tokens",
  }
);

const tokenModel = mongoose.model<IToken, ITokenModel>("Token", tokenSchema);

type HydratedToken = mongoose.HydratedDocument<IToken & ITimestamps>;

export { tokenModel, type HydratedToken };
