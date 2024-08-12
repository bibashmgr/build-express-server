import express from "express";

// middlewares
import { authenticate, validate } from "../middlewares";

// validations
import { userValidation } from "../validations";

// controllers
import { userController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    authenticate("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
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
  )
  .patch(
    authenticate("manageUsers"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    authenticate("manageUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
