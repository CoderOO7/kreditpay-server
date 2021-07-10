const _ = require("lodash");
const User = require("../models/User");
const Loan = require("../models/Loan");
const { userRole } = require("../utils/user");
const { loanStatus } = require("../utils/loan");

const calculateLoanInterest = (principle) => {
  let interest = 0;
  if (principle >= 500 && principle <= 1000) {
    interest = 2;
  } else if (principle <= 10000) {
    interest = 3;
  } else {
    interest = 4;
  }
  return interest;
};

const calculateRepaymentAmount = ({
  loanAmount,
  monthsToRepay,
  interestRate,
}) => {
  const applicationFee = 200;
  const principle = loanAmount;
  const interestPerMonth = (principle / 100) * interestRate;
  const totalInterest = interestPerMonth * monthsToRepay;

  const x = totalInterest + applicationFee + parseInt(principle, 10);
  return x;
};
/**
 * POST /v1/loan
 * Create new loan for a valid user
 */
exports.createNewLoan = async (req, res) => {
  const result = {};
  let status = 201;

  try {
    const {
      user_id,
      customer_email,
      loan_amount: loanAmount,
      months_to_repay: monthsToRepay,
    } = req.body;
    const user = await User.findById(user_id);
    if (user) {
      if (user.role === userRole.AGENT) {
        const customer = await User.find({ email: customer_email });
        if (!_.isEmpty(customer)) {
          const interestRate = calculateLoanInterest(loanAmount);
          const repaymentAmount = calculateRepaymentAmount({
            loanAmount,
            monthsToRepay,
            interestRate,
          });

          const status = loanStatus.NEW;
          const emi = repaymentAmount / monthsToRepay;
          const loan = await Loan.create({
            user: user_id,
            principal: loanAmount,
            interest: interestRate,
            monthsToRepay,
            emi,
            status,
          });
          result.data = {
            id: loan._id,
            emi_per_month: emi,
            amount_to_repay: repaymentAmount,
          };
        } else {
          status = 401;
          result.status = status;
          result.errors = [
            {
              title: "Authentication error",
              message: "Provided customer email id is not registered",
            },
          ];
        }
      } else {
        status = 401;
        result.status = status;
        result.errors = [
          {
            title: "Authentication error",
            message: "Only agent can create this loan",
          },
        ];
      }
    } else {
      status = 401;
      result.status = status;
      result.errors = [
        {
          title: "Authentication error",
          message: "Provided user id is invalid",
        },
      ];
    }
  } catch (err) {
    console.error(err);
    status = 500;
    result.errors = [
      {
        title: "Server error",
        message: "You may try again or wait till the error get resolve.",
      },
    ];
  }
  return res.status(status).json(result);
};

/**
 * GET /v1/loans
 * Return list of loan from database
 */
exports.getBulkLoan = async (req, res) => {
  return res.status(200).json();
};

/**
 * GET /v1/loan/:id
 * Return single loan entity from database
 */
exports.getLoan = async (req, res) => {
  return res.status(200).json();
};

/**
 * PUT /v1/loan/:id/approve
 * Update the loan status pending to approve
 */
exports.approveLoan = async (req, res) => {
  return res.status(201).json();
};

/**
 * PUT /v1/loan/:id/rejct
 * Update the loan status from pending to rejected
 */
exports.rejectLoan = async (req, res) => {
  return res.status(201).json();
};
