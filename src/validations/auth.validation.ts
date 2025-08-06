import { z } from "zod";

const passwordSchema = z
  .string({
    message: "Password is required",
  })
  .regex(/^.{8,20}$/, {
    message: "Password must be between 8 and 20 characters long",
  })
  .regex(/(?=.*[A-Z])/, {
    message: "Password must include at least one uppercase letter",
  })
  .regex(/(?=.*[a-z])/, {
    message: "Password must include at least one lowercase letter",
  })
  .regex(/(?=.*\d)/, {
    message: "Password must include at least one numeric digit",
  })
  .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
    message: "Password must include at least one special character",
  });

const registerUser = z.object({
  body: z.object({
    email: z.email({
      message: "Email is invalid",
    }),
    name: z
      .string({
        message: "Name is required",
      })
      .trim()
      .min(2, {
        message: "Name must be at least 2 characters",
      }),
    password: passwordSchema,
  }),
});

type RegisterUserRequest = z.infer<typeof registerUser>;

const sendAccountVerificationCode = z.object({
  body: z.object({
    email: z.email({
      message: "Email is invalid",
    }),
  }),
});

type SendAccountVerificationCodeRequest = z.infer<
  typeof sendAccountVerificationCode
>;

const verifyAccount = z.object({
  body: z.object({
    email: z.email({
      message: "Email is invalid",
    }),
    code: z
      .string({
        message: "OTP code is required",
      })
      .length(6, {
        message: "OTP code must be 6 characters long",
      }),
  }),
});

type VerifyAccountRequest = z.infer<typeof verifyAccount>;

const loginUser = z.object({
  body: z.object({
    email: z.email({
      message: "Invalid email",
    }),
    password: passwordSchema,
  }),
});

type LoginUserRequest = z.infer<typeof loginUser>;

const forgotPassword = z.object({
  body: z.object({
    email: z.email({
      message: "Invalid email",
    }),
  }),
});

type ForgotPasswordRequest = z.infer<typeof forgotPassword>;

const resetPassword = z.object({
  body: z.object({
    email: z.email({
      message: "Email is invalid",
    }),
    code: z
      .string({
        message: "OTP code is required",
      })
      .length(6, {
        message: "OTP code must be 6 characters long",
      }),
    password: passwordSchema,
  }),
});

type ResetPasswordRequest = z.infer<typeof resetPassword>;

const refreshToken = z.object({
  body: z.object({
    refreshToken: z
      .string({
        message: "Refresh Token is required",
      })
      .nonempty({
        message: "Refresh token must not be empty",
      }),
  }),
});

type RefreshTokenRequest = z.infer<typeof refreshToken>;

const logoutUser = z.object({
  body: z.object({
    refreshToken: z
      .string({
        message: "Refresh token is required",
      })
      .nonempty({
        message: "Refresh token must not be empty",
      }),
  }),
});

type LogoutUserRequest = z.infer<typeof logoutUser>;

export {
  registerUser,
  type RegisterUserRequest,
  sendAccountVerificationCode,
  type SendAccountVerificationCodeRequest,
  verifyAccount,
  type VerifyAccountRequest,
  loginUser,
  type LoginUserRequest,
  forgotPassword,
  type ForgotPasswordRequest,
  resetPassword,
  type ResetPasswordRequest,
  refreshToken,
  type RefreshTokenRequest,
  logoutUser,
  type LogoutUserRequest,
};
