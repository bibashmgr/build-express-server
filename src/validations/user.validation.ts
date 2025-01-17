import Joi from "joi";

import { objectIdValidation, passwordValidation } from "./custom.validation";

export const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    password: Joi.string().required().custom(passwordValidation),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

export const getUsers = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    name: Joi.string(),
    page: Joi.number().integer(),
    role: Joi.string(),
    sortBy: Joi.string(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectIdValidation),
  }),
};

export const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      password: Joi.string().custom(passwordValidation),
    })
    .min(1),
  params: Joi.object().keys({
    userId: Joi.required().custom(objectIdValidation),
  }),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectIdValidation),
  }),
};
