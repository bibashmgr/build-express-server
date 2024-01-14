import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";

// constants
import { tokenTypes } from "../constants/schemas";
import { config } from "../constants/config";

// models
import { Token } from "../models";

// helpers
import ApiError from "../helpers/ApiError";

// This function generates a particular type of token
const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: moment.Moment,
  type: string,
  secret: string = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
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
  blacklisted: boolean = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

// This function verifies whether the token is valid or not
export const verifyToken = async (token: string, type: tokenTypes) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
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
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
