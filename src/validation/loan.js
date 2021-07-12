const Validator = require("validator");
const isEmpty = require("is-empty");
const _ = require("lodash");

function validateLoanCreateInputs(_data) {
  const data = _.cloneDeep(_data);
  const errors = [];
  let error = {};
  const title = "Validation error";

  // Setting empty fields to a empty string to make validator object work
  data.loan_amount = !isEmpty(data.loan_amount) ? data.loan_amount : "";
  data.months_to_repay = !isEmpty(data.months_to_repay)
    ? data.months_to_repay
    : "";
  data.customer_email = !isEmpty(data.customer_email)
    ? data.customer_email
    : "";

  // first name check
  if (Validator.isEmpty(data.loan_amount)) {
    error = {};
    error.loan_amount = { title, message: "Required laon amount" };
    errors.push(error);
  }

  // last name check
  if (Validator.isEmpty(data.months_to_repay)) {
    error = {};
    error.months_to_repay = { title, message: "Required months to repay" };
    errors.push(error);
  }

  // customer_email check
  if (Validator.isEmpty(data.customer_email)) {
    error = {};
    error.customer_email = {
      title,
      message: "Customer email field is required",
    };
    errors.push(error);
  } else if (!Validator.isEmail(data.customer_email)) {
    error = {};
    error.customer_email = { title, message: "Customer email is invalid" };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateLoanCreateInputs };
