import { UserRoleEnum } from "../types";

const allRoles: Record<UserRoleEnum, string[]> = {
  [UserRoleEnum.ADMIN]: ["getUsers", "manageUsers"],
  [UserRoleEnum.USER]: [],
};

const roles = Object.keys(UserRoleEnum);
const roleRights = new Map<string, string[]>(Object.entries(allRoles));

export { roles, roleRights };
