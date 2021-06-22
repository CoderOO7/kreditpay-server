const Validator = require("validator");
const isEmpty = require("is-empty");

function validateSignUpInputs(data) {
  let errors = [];
  let error = {};
  let title = "Validation error";

  // Setting empty fields to a empty string to make validator object work
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2: "";

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

  // Password check
  if (Validator.isEmpty(data.password)) {
    error = {};
    error.password = { title, message: "Password field is required" };
    errors.push(error);
  } else if (!Validator.isLength(data.password, { min: 6, max: 24 })) {
    error = {};
    error.password = {
      title,
      message:
        "Password must be at least 6 charaters and at most 24 characters long",
    };
    errors.push(error);
  }

  // Password 2 check
  if (Validator.isEmpty(data.password2)) {
    error = {};
    error.password2 = { title, message: "Password field is required" };
  } else if (!Validator.equals(data.password, data.password2)) {
    error = {};
    error.password2 = { title, message: "Password should match" };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {validateSignUpInputs};
