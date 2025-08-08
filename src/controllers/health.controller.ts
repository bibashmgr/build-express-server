import express from "express";
import httpStatus from "http-status";

import { catchAsync } from "../helpers/catchAsync";

const getHealth = catchAsync((req: express.Request, res: express.Response) => {
  res.status(httpStatus.OK).send({
    timestamp: new Date(),
    uptime: process.uptime(),
    clientIp: req.ip,
    message: "Server is up and running",
  });
});

export { getHealth };
