import Joi from "joi";

import { passwordValidation } from "./custom.validation";

export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    password: Joi.string().required().custom(passwordValidation),
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
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(passwordValidation),
  }),
  query: Joi.object().keys({
    otp: Joi.number().required(),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    otp: Joi.number().required(),
  }),
};
