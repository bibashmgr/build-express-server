import { logger } from "../utils/logger";

function runAsync<T>(promise: Promise<T>, label: string) {
  promise.catch((err) => {
    logger.error(`${label}:`, err);
  });
}

export { runAsync };
