const Validator = require("validator");
const isEmpty = require("is-empty");
const _ = require("lodash");

function validatePostContactUs(_data) {
  const data = _.cloneDeep(_data);
  const errors = [];
  let error = {};
  const title = "Validation error";

  // Setting empty fields to a empty string to make validator object work
  data.name = !isEmpty(data.name) ? data.name : "";
  data.message = !isEmpty(data.message) ? data.message : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.name)) {
    error = {};
    error.name = { title, message: "Name is required" };
    errors.push(error);
  }

  if (Validator.isEmpty(data.message)) {
    error = {};
    error.message = { title, message: "Message is required" };
    errors.push(error);
  }

  if (Validator.isEmpty(data.email)) {
    error = {};
    error.email = {
      title,
      message: "Email field is required",
    };
    errors.push(error);
  } else if (!Validator.isEmail(data.email)) {
    error = {};
    error.email = { title, message: "Email is invalid" };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validatePostContactUs };
