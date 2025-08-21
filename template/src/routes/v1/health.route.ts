import express from "express";

import { healthController } from "../../controllers";

const router = express.Router();

router.route("/").get(healthController.getHealth);

export default router;
