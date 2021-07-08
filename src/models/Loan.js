const mongoose = require("mongoose");
const { loanStatus } = require("../utils/loan");

const loanSchema = new mongoose.Schema({
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
  },

  monthsToRepay: {
    type: Number,
  },

  emi: {
    type: Number,
  },

  status: {
    enum: [
      loanStatus.NEW,
      loanStatus.PENDING,
      loanStatus.REJECTED,
      loanStatus.APPROVED,
    ],
  },
});

const Loan = new mongoose.model("Loan", loanSchema);
module.exports = Loan;
