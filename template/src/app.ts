import helmet from "helmet";
import express from "express";
import passport from "passport";
import httpStatus from "http-status";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";

import {
  morgan,
  errorHandler,
  errorConverter,
  xssSanitize,
  mongoSanitize,
} from "./middlewares";
import routes from "./routes/v1";
import { config } from "./constants/config";
import { ApiError } from "./helpers/apiError";
import { jwtStrategy } from "./utils/passport";

const app = express();

// middleware for logging
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// sets various HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xssSanitize());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
};
app.use(cors(corsOptions));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated requests to given endpoints
if (config.env === "production") {
  const defaultLimiter = rateLimit({
    windowMs: config.rateLimit.intervalMinutes * 60 * 1000,
    limit: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Too many requests, please try again later",
    },
  });
  const limitedPaths = ["/v1/health", "/v1/auth"];

  limitedPaths.forEach((path) => {
    app.use(path, defaultLimiter);
  });
}

// api-routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not Found!"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// format ApiError
app.use(errorHandler);

export default app;
