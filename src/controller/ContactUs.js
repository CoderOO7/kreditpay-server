import { validatePostContactUs } from "../validation/contactUs";
import ContactUs from "../models/ConstactUs";

/**
 * POST /v1/forms/public/contactUs
 * Save new contact info
 */
exports.postContactUs = async (req, res) => {
  const result = {};
  let status = 201;
  try {
    const { isValid, errors } = validatePostContactUs(req.body);
    if (!isValid) {
      status = 422;
      result.errors = errors;
      return res.status(status).json(result);
    }

    const { name, email, message } = req.body;
    const newContact = new ContactUs({ name, email, message });
    await newContact.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      status = 422;
      result.errors = [{ ...err.errors }];
    } else {
      status = 500;
      result.errors = [
        {
          title: "Server error",
          message: "You may try again or wait till the error get resolve.",
        },
      ];
    }
  }
  return res.status(status).json(result);
};
