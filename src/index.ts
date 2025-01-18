import http from "http";
import mongoose from "mongoose";

import app from "./app";
import { config } from "./constants/config";
import { logger } from "./utils/logger";

let server: http.Server;

mongoose
  .connect(
    config.mongoose.url,
    config.mongoose.options as mongoose.ConnectOptions
  )
  .then(() => {
    logger.info("Connected to MongoDB");
    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${String(config.port)}`);
    });
  })
  .catch((error: unknown) => {
    logger.error("MongoDB connection error: ", error);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
