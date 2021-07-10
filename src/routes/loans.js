const controller = require("../controller/Loan");

module.exports = (router) => {
  router.route("/v1/loans").post(controller.createNewLoan);
  router.route("/v1/loans").get(controller.getBulkLoan);
  router.route("/v1/loans/:id").get(controller.getLoan);
  router.route("/v1/loans/:id/approve").put(controller.approveLoan);
  router.route("/v1/loans/:id/reject").put(controller.rejectLoan);
};
