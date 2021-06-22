const controller = require("../controller/User");
const { validateToken } = require("../utils/jwt");

module.exports = (router) => {
  router.route("/v1/users").get(validateToken, controller.getUsers);

  router.route("/v1/users/").post(validateToken, controller.createUser);

  router.route("/v1/users/:id").get(controller.getUser);

  router.route("/v1/users/:id").delete(validateToken, controller.deleteUser);

  router.route("/v1/users/:id").put(validateToken, controller.updateUser);

  router.route("/v1/signup").post(controller.postSignup);

  router.route("/v1/login").post(controller.postLogin);
};
