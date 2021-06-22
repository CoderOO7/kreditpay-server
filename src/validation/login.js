const Validator = require("validator");
const isEmpty = require("is-empty");

function validateLoginInputs(data) {
  let errors = [];
  let error = {};
  let title = "Validation error";
  // Setting empty fields to an empty string to make validator object work
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email check
  if (Validator.isEmpty(data.email)) {
    error = {};
    error.email = { title, message: "Email field is required" };
    errors.push(error);
  } else if (!Validator.isEmail(data.email)) {
    error = {};
    error.email = { title, message: "Email is invalid" };
    errors.push(error);
  }

  // Password check
  if (Validator.isEmpty(data.password)) {
    error = {};
    error.password = { title, message: "Password field is required" };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateLoginInputs };
