import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type VerifiedCallback,
} from "passport-jwt";

import { TokenEnum } from "../types";
import { userService } from "../services";
import { config } from "../constants/config";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

async function jwtVerify(payload: any, done: VerifiedCallback) {
  try {
    if (payload.type !== TokenEnum.ACCESS) {
      throw new Error("Invalid token type");
    }

    const user = await userService.getUserById(payload.sub);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
