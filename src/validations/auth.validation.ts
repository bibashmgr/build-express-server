import Joi from "joi";

import { passwordValidation } from "./custom.validation";

export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidation),
    name: Joi.string().required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    otp: Joi.number().required(),
  }),
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(passwordValidation),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    otp: Joi.number().required(),
  }),
};
