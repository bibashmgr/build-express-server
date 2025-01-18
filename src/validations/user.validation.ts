import { z } from "zod";

export const createUser = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    name: z.string({
      message: "Name is required",
    }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
    role: z.enum(["user", "admin"], {
      message: "Invalid role",
    }),
  }),
});

export const getUsers = z.object({
  query: z.object({
    limit: z.coerce.number().optional(),
    name: z.string().optional(),
    page: z.coerce.number().optional(),
    role: z.string().optional(),
    sortBy: z.string().optional(),
  }),
});

export const getUser = z.object({
  params: z.object({
    userId: z.string({
      message: "UserId is required",
    }),
  }),
});

export const updateUser = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    password: z.string().optional(),
  }),
  params: z.object({
    userId: z.string({
      message: "UserId is required",
    }),
  }),
});

export const deleteUser = z.object({
  params: z.object({
    userId: z.string({
      message: "UserId is required",
    }),
  }),
});
