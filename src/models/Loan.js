const mongoose = require("mongoose");
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
      enum: [
        loanStatus.NEW,
        loanStatus.PENDING,
        loanStatus.REJECTED,
        loanStatus.APPROVED,
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = new mongoose.model("Loan", loanSchema);
module.exports = Loan;
