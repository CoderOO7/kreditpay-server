const userRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  AGENT: "agent",
};

const isUserRoleValid = (role) => {
  let flag = false;
  Object.keys(userRole).forEach((key) => {
    if (userRole[key] === role) {
      flag = true;
    }
  });
  return flag;
};

module.exports = { userRole, isUserRoleValid };
