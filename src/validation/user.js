const Validator = require("validator");
const isEmpty = require("is-empty");
const _ = require("lodash");
const { isUserRoleValid } = require("../utils/user");

function validateUserCreateORUpdateInputs(_data) {
  const data = _.cloneDeep(_data);
  const errors = [];
  let error = {};
  const title = "Validation error";

  // Setting empty fields to a empty string to make validator object work
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.role = !isEmpty(data.role) ? data.role : "";

  // first name check
  if (Validator.isEmpty(data.first_name)) {
    error = {};
    error.first_name = { title, message: "Required first name" };
    errors.push(error);
  }

  // last name check
  if (Validator.isEmpty(data.last_name)) {
    error = {};
    error.last_name = { title, message: "Required last name" };
    errors.push(error);
  }

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

  // last name check
  if (Validator.isEmpty(data.role)) {
    error = {};
    error.last_name = { title, message: "Required user role" };
    errors.push(error);
  } else if (!isUserRoleValid(data.role)) {
    error = {};
    error.last_name = { title, message: "User role is invalid" };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateUserCreateORUpdateInputs };
