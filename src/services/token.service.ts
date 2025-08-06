import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { addDays, addMinutes, getUnixTime } from "date-fns";

import { TokenEnum } from "../types";
import { tokenModel } from "../models";
import { config } from "../constants/config";
import { ApiError } from "../helpers/apiError";

// This function generates a particular type of token
function generateToken(
  userId: string,
  expires: number,
  type: string,
  secret: string
) {
  const payload = {
    exp: expires,
    iat: getUnixTime(new Date()),
    sub: userId,
    type,
  };
  return jwt.sign(payload, secret);
}

// This function saves the generated token in database
async function saveToken(
  token: string,
  userId: string,
  expires: Date,
  type: TokenEnum,
  blacklisted = false
) {
  const tokenDoc = await tokenModel.create({
    type,
    token,
    user: userId,
    expires,
    blacklisted,
  });
  return tokenDoc;
}

// This function generates authentication tokens
async function generateAuthTokens(userId: string) {
  const accessTokenExpires = addMinutes(
    new Date(),
    config.jwt.accessExpirationMinutes
  );
  const accessToken = generateToken(
    userId,
    getUnixTime(accessTokenExpires),
    TokenEnum.ACCESS,
    config.jwt.secret
  );

  const refreshTokenExpires = addDays(
    new Date(),
    config.jwt.refreshExpirationDays
  );
  const refreshToken = generateToken(
    userId,
    getUnixTime(refreshTokenExpires),
    TokenEnum.REFRESH,
    config.jwt.secret
  );

  await saveToken(refreshToken, userId, refreshTokenExpires, TokenEnum.REFRESH);

  return {
    access: {
      expires: accessTokenExpires,
      token: accessToken,
    },
    refresh: {
      expires: refreshTokenExpires,
      token: refreshToken,
    },
  };
}

// This function verifies whether the token is valid or not
async function verifyToken(token: string, type: TokenEnum) {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await tokenModel.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token Not Found");
  }
  return tokenDoc;
}

// This function delete all the tokens associated with the given userId
async function deleteTokensByUserId(userId: string, type: TokenEnum) {
  return await tokenModel.deleteMany({
    type,
    user: userId,
  });
}

export { generateAuthTokens, verifyToken, deleteTokensByUserId };
