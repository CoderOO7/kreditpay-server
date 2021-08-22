const controller = require("../controller/ContactUs");

module.exports = (router) => {
  router.route("/v1/forms/public/contact").post(controller.postContactUs);
};
