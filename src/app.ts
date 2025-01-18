import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import passport from "passport";

import { config } from "./constants/config";
import ApiError from "./helpers/ApiError";
import { errorConverter, errorHandler } from "./middlewares";
import routes from "./routes/v1";
import { morganHandler } from "./utils/morgan";
import { jwtStrategy } from "./utils/passport";

const app = express();

app.use(morganHandler.successHandler);
app.use(morganHandler.errorHandler);

app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use(
    "/v1/auth",
    rateLimit({
      max: 20,
      skipSuccessfulRequests: true,
      windowMs: 15 * 60 * 1000,
    })
  );
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
