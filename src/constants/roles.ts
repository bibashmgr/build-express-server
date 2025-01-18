const allRoles = {
  admin: ["getUsers", "manageUsers"],
  user: [],
};

export const roles = Object.keys(allRoles);

export const roleRights = new Map<string, string[]>(Object.entries(allRoles));
