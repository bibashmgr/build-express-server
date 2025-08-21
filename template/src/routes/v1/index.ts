import express from "express";

import authRoute from "./auth.route";
import userRoute from "./user.route";
import healthRoute from "./health.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/health",
    route: healthRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
