const allRoles = {
  user: [],
  admin: ["getUsers", "manageUsers"],
};

const roles = Object.keys(allRoles);

const roleRights = new Map<string, string[]>(Object.entries(allRoles));

export { roles, roleRights };
