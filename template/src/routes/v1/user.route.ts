import express from "express";

import { userController } from "../../controllers";
import { userValidation } from "../../validations";
import { authenticate, validate } from "../../middlewares";
import { UserRightEnum } from "../../types";

const router = express.Router();

router
  .route("/")
  .get(
    authenticate(UserRightEnum.GET_USERS),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router.route("/me").get(authenticate(), userController.getMyProfile);

router
  .route("/:userId")
  .get(
    authenticate(UserRightEnum.MANAGE_USERS),
    validate(userValidation.getUser),
    userController.getUser
  );

export default router;
