import httpStatus from "http-status";

import { userModel } from "../models";
import { UpdateUserPayload } from "../types";
import { ApiError } from "../helpers/apiError";
import { authValidation } from "../validations";

// This function creates and returns new user
async function createUser(payload: authValidation.RegisterUserRequest["body"]) {
  if (await userModel.isEmailTaken(payload.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return await userModel.create(payload);
}

// This function finds and returns userInfo using email
async function getUserByEmail(email: string) {
  return await userModel.findOne({ email });
}

// This function finds and returns userInfo using userId
async function getUserById(id: string) {
  return await userModel.findById(id);
}

// This function returns all users
async function queryUsers(
  filter: Record<string, any> = {},
  options: Record<string, any> = {}
) {
  const users = await userModel.paginate(filter, options);
  return users;
}

// This function finds existing user by userID and updates it.
async function updateUserById(id: string, payload: UpdateUserPayload) {
  return await userModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
}

export { createUser, getUserByEmail, getUserById, queryUsers, updateUserById };
