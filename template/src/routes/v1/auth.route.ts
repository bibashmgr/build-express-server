import express from "express";

import { authController } from "../../controllers";
import { authValidation } from "../../validations";
import { authenticate, validate } from "../../middlewares";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.registerUser),
  authController.registerUser
);

router.post(
  "/send-verification-code",
  validate(authValidation.sendAccountVerificationCode),
  authController.sendAccountVerificationCode
);

router.post(
  "/verify-account",
  validate(authValidation.verifyAccount),
  authController.verifyAccount
);

router.post(
  "/login",
  validate(authValidation.loginUser),
  authController.loginUser
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
  "/refresh-token",
  validate(authValidation.refreshToken),
  authController.refreshToken
);

router.post(
  "/logout",
  authenticate(),
  validate(authValidation.logoutUser),
  authController.logoutUser
);

export default router;
