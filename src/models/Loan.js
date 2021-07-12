const mongoose = require("mongoose");
const validator = require("validator");
const { loanStatus } = require("../utils/loan");

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    principal: {
      type: Number,
      required: true,
    },

    interest: {
      type: Number,
      required: true,
    },

    monthsToRepay: {
      type: Number,
      required: true,
    },

    emi: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [loanStatus.NEW, loanStatus.REJECTED, loanStatus.APPROVED],
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
      validate: (value) => validator.isEmail(value),
    },
  },
  { timestamps: true }
);

const Loan = new mongoose.model("Loan", loanSchema);
module.exports = Loan;
