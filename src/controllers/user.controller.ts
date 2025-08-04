import express from "express";
import httpStatus from "http-status";

import { userService } from "../services";
import { ApiError } from "../helpers/apiError";
import { catchAsync } from "../helpers/catchAsync";
import { filterObject } from "../helpers/filterObject";

const getUsers = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const filter = filterObject(req.query, ["name", "role"]);
    const options = filterObject(req.query, ["sortBy", "limit", "page"]);

    const result = await userService.queryUsers(filter, options);
    res.status(httpStatus.OK).send(result);
  }
);

const getUser = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "No user found");
    }
    res.status(httpStatus.OK).send(user);
  }
);

const getMyProfile = catchAsync(
  (req: express.Request, res: express.Response) => {
    res.status(httpStatus.OK).send(req.user);
  }
);

export { getUsers, getUser, getMyProfile };
