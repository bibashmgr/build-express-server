import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import {
  PaginateOptions,
  ITimestamps,
  PaginatedData,
  IUser,
  UserResponse,
  UserRoleEnum,
} from "../types";
import { paginate, toJSON } from "../plugins";

interface IUserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel
  extends mongoose.Model<IUser & ITimestamps, unknown, IUserMethods> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginate: (
    filter: any,
    options: PaginateOptions
  ) => Promise<PaginatedData<UserResponse>>;
  toJSON: (schema: any) => Promise<UserResponse>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      private: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.USER,
    },
    avatar: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.static(
  "isEmailTaken",
  async function (email: string, excludeUserId?: string) {
    const user: IUser | null = await this.findOne({
      email,
      _id: { $ne: excludeUserId },
    });
    return !!user;
  }
);

userSchema.method(
  "isPasswordMatch",
  async function isPasswordMatch(password: string) {
    return bcrypt.compare(password, this.password);
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const userModel = mongoose.model<IUser, IUserModel>("IUser", userSchema);

type HydratedUser = mongoose.HydratedDocument<
  IUser & ITimestamps,
  IUserMethods
>;

export { userModel, type HydratedUser };
