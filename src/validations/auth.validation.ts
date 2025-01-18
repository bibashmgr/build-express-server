import { z } from "zod";

export const register = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    name: z
      .string({
        message: "Name is required",
      })
      .trim()
      .min(2, {
        message: "Name must be at least 2 characters",
      }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  }),
});

export const login = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  }),
});

export const logout = z.object({
  body: z.object({
    refreshToken: z.string({
      message: "Refresh Token is required",
    }),
  }),
});

export const refreshTokens = z.object({
  body: z.object({
    refreshToken: z.string({
      message: "Refresh Token is required",
    }),
  }),
});

export const forgotPassword = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid Email",
      }),
  }),
});

export const resetPassword = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid Email",
      }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  }),
  query: z.object({
    otp: z.number({
      message: "OTP code is required",
    }),
  }),
});

export const verifyEmail = z.object({
  query: z.object({
    otp: z.number({
      message: "OTP code is required",
    }),
  }),
});
