import { ITimestamps } from "./shared.type";

export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  avatar: string;
  isEmailVerified: boolean;
}

export type UserResponse = Omit<IUser, "password"> &
  ITimestamps & {
    id: string;
  };

export type UpdateUserPayload = {
  name?: string;
  password?: string;
  role?: string;
  isEmailVerified?: boolean;
};
