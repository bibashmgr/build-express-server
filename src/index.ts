import http from "http";
import mongoose from "mongoose";

// constants
import { config } from "./constants/config";

// utils
import { logger } from "./utils/logger";

import app from "./app";

let server: http.Server;

mongoose
  .connect(
    config.mongoose.url,
    config.mongoose.options as mongoose.ConnectOptions
  )
  .then(() => {
    logger.info("Connected to MongoDB");
    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
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
