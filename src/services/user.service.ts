import mongoose from "mongoose";
import httpStatus from "http-status";

// helpers
import ApiError from "../helpers/ApiError";

// models
import { User } from "../models";

// This function creates and returns new user
export const createUser = async (userBody: Record<string, any>) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Taken");
  }
  return User.create(userBody);
};

// This function finds and returns userInfo using email
export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

// This function finds and returns userInfo using userId
export const getUserById = async (id: mongoose.Types.ObjectId | string) => {
  return User.findById(id);
};

// This function returns all users
export const queryUsers = async (filter: any, options: any) => {
  const users = await User.paginate(filter, options);
  return users;
};

// This function finds existing user by userID and updates it.
export const updateUserById = async (
  userId: mongoose.Types.ObjectId | string,
  updateBody: any
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

// This function finds existing user by userID & deletes it
export const deleteUserById = async (
  userId: mongoose.Types.ObjectId | string
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }
  await user.deleteOne();
  return user;
};
