const Validator = require("validator");
const { cloneDeep, isEmpty } = require("lodash");

function validatePagination(_query) {
  const query = cloneDeep(_query);
  const errors = [];
  let error = {};
  const title = "Validation error";

  if (!Validator.isNumeric(query.offset) || query.offset < 0) {
    error = {};
    error.offset = {
      title,
      message:
        "In request query, offset should be a number & can't be negative",
    };
    errors.push(error);
  }
  if (!Validator.isNumeric(query.limit)) {
    error = {};
    error.limit = {
      title,
      message: "In request query, limit should be a number",
    };
    errors.push(error);
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export default validatePagination;
export { validatePagination };
