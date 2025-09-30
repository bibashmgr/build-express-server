import { UserRightEnum, UserRoleEnum } from "../types";

const allRoles: Record<UserRoleEnum, string[]> = {
  [UserRoleEnum.ADMIN]: [UserRightEnum.GET_USERS, UserRightEnum.MANAGE_USERS],
  [UserRoleEnum.USER]: [],
};

const roles = Object.keys(UserRoleEnum);
const roleRights = new Map<string, string[]>(Object.entries(allRoles));

export { roles, roleRights };
