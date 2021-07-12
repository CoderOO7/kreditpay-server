const controller = require("../controller/Loan");
const { validateToken } = require("../utils/jwt");

module.exports = (router) => {
  router.route("/v1/loans").post(validateToken, controller.createNewLoan);
  router.route("/v1/loans").get(validateToken, controller.getBulkLoan);
  router.route("/v1/loans/:id").get(validateToken, controller.getLoan);
  router
    .route("/v1/loans/:id/approve")
    .put(validateToken, controller.approveLoan);
  router
    .route("/v1/loans/:id/reject")
    .put(validateToken, controller.rejectLoan);
};
