const mongoose = require("mongoose");
const validator = require("validator");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      validate: (value) => validator.isEmail(value),
    },
  },
  { timestamps: true }
);

const ContactUs = new mongoose.model("ContactUs", contactUsSchema);
module.exports = ContactUs;
