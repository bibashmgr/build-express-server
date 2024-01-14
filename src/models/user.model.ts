import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import validator from "validator";

// constants
import { roles } from "../constants/roles";

// plugins
import { IPaginateOptions, paginate, toJSON } from "../plugins";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IUserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUser, {}, IUserMethods> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId | string
  ): Promise<mongoose.HydratedDocument<IUser, IUserMethods>>;
  paginate: (filter: any, options: IPaginateOptions) => Promise<void>;
  toJSON: (schema: any) => Promise<void>;
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
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
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
    const user: IUser = this;
    return bcrypt.compare(password, user.password);
  }
);

userSchema.pre("save", async function (next) {
  const user: IUser = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
