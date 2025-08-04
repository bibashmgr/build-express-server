import express from "express";

import { userController } from "../../controllers";
import { userValidation } from "../../validations";
import { authenticate, validate } from "../../middlewares";

const router = express.Router();

router
  .route("/")
  .get(
    authenticate("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router.route("/me").get(authenticate(), userController.getMyProfile);

router
  .route("/:userId")
  .get(
    authenticate("getUsers"),
    validate(userValidation.getUser),
    userController.getUser
  );

export default router;
