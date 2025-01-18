import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import moment from "moment";
import mongoose from "mongoose";

import { config } from "../constants/config";
import ApiError from "../helpers/ApiError";
import { Token } from "../models";
import { TokenEnum } from "../types/token.type";

// This function generates a particular type of token
const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: moment.Moment,
  type: string,
  secret: string = config.jwt.secret
) => {
  const payload = {
    exp: expires.unix(),
    iat: moment().unix(),
    sub: userId,
    type,
  };
  return jwt.sign(payload, secret);
};

// This function saves the generated token in database
const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: moment.Moment,
  type: string,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    blacklisted,
    expires: expires.toDate(),
    token,
    type,
    user: userId,
  });
  return tokenDoc;
};

// This function verifies whether the token is valid or not
export const verifyToken = async (token: string, type: TokenEnum) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    blacklisted: false,
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token Not Found");
  }
  return tokenDoc;
};

// This function generates authentication tokens
export const generateAuthTokens = async (user: any) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    TokenEnum.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TokenEnum.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TokenEnum.REFRESH
  );

  return {
    access: {
      expires: accessTokenExpires.toDate(),
      token: accessToken,
    },
    refresh: {
      expires: refreshTokenExpires.toDate(),
      token: refreshToken,
    },
  };
};
