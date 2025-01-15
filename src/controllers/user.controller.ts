import express from "express";
import httpStatus from "http-status";

import { pick } from "../helpers/pick";
import { userService } from "../services";
import ApiError from "../helpers/ApiError";
import catchAsync from "../helpers/catchAsync";
import successHandler from "../helpers/successHandler";

export const createUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const user = await userService.createUser(req.body);
    res
      .status(httpStatus.CREATED)
      .send(successHandler(user, "Create new user"));
  }
);

export const getUsers = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const filter = pick(req.query, ["role"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await userService.queryUsers(filter, options);
    res.status(httpStatus.OK).send(successHandler(result, "Fetch users"));
  }
);

export const getUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    res.status(httpStatus.OK).send(successHandler(user, "Fetch userInfo"));
  }
);

export const getMyProfile = catchAsync(
  async (req: express.Request, res: express.Response) => {
    res
      .status(httpStatus.OK)
      .send(successHandler(req.user, "Fetch my profile"));
  }
);

export const updateUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.status(httpStatus.OK).send(successHandler(user, "Update userInfo"));
  }
);

export const deleteUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.OK).send(successHandler(null, "Delete user"));
  }
);
