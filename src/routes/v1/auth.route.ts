import express from "express";

import { authValidation } from "../../validations";
import { authController } from "../../controllers";
import { validate, authenticate } from "../../middlewares";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

router.post("/login", validate(authValidation.login), authController.login);

router.post("/logout", validate(authValidation.logout), authController.logout);

router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.post(
  "/send-verification-email",
  authenticate(),
  authController.sendVerificationEmail
);

router.post(
  "/verify-email",
  authenticate(),
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

export default router;
