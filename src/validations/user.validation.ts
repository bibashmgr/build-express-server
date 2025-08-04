import { z } from "zod";
import mongoose from "mongoose";

import { UserRoleEnum } from "../types";

const getUsers = z.object({
  query: z.object({
    limit: z.coerce
      .number({
        message: "Limit must be number",
      })
      .optional(),
    page: z.coerce
      .number({
        message: "Page must be number",
      })
      .optional(),
    role: z
      .enum(UserRoleEnum, {
        message: "Role is invalid",
      })
      .optional(),
    sortBy: z.string().optional(),
  }),
});

type GetUsersRequest = z.infer<typeof getUsers>;

const getUser = z.object({
  params: z.object({
    userId: z.string().refine(
      (val) => {
        return mongoose.isValidObjectId(val);
      },
      {
        message: "UserId is invalid",
      }
    ),
  }),
});

type GetUserRequest = z.infer<typeof getUser>;

export { getUsers, type GetUsersRequest, getUser, type GetUserRequest };
