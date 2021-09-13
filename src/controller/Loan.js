const _ = require("lodash");
const User = require("../models/User");
const Loan = require("../models/Loan");
const { userRole } = require("../utils/user");
const { loanStatus } = require("../utils/loan");
const { validateLoanCreateInputs } = require("../validation/loan");

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
/* exports.createNewLoan = async (req, res) => {
  const result = {};
  let status = 201;

  try {
    const {
      customer_email,
      loan_amount: loanAmount,
      months_to_repay: monthsToRepay,
    } = req.body;
    const payload = req.decoded;
    if (payload) {
      if (payload.userRole === userRole.AGENT) {
        const { isValid, errors } = validateLoanCreateInputs(req.body);
        if (!isValid) {
          status = 422;
          result.errors = errors;
          return res.status(status).json(result);
        }

        const customer = await User.find({ email: customer_email });
        if (!_.isEmpty(customer)) {
          if (customer[0].role === userRole.CUSTOMER) {
            const interestRate = calculateLoanInterest(loanAmount);
            const repaymentAmount = calculateRepaymentAmount({
              loanAmount,
              monthsToRepay,
              interestRate,
            });

            const status = loanStatus.NEW;
            const emi = repaymentAmount / monthsToRepay;
            const loan = await Loan.create({
              principal: loanAmount,
              interest: interestRate,
              monthsToRepay,
              emi,
              status,
              customerEmail: customer_email,
            });
            result.data = {
              id: loan._id,
              emi_per_month: emi,
              amount_to_repay: repaymentAmount,
            };
          } else {
            status = 403;
            result.status = status;
            result.errors = [
              {
                title: "Resource Forbidden error",
                message: "Only user of type customer are elligible for loan",
              },
            ];
          }
        } else {
          status = 400;
          result.status = status;
          result.errors = [
            {
              title: "Bad Request",
              message: "Provided customer email id is not registered",
            },
          ];
        }
      } else {
        status = 403;
        result.status = status;
        result.errors = [
          {
            title: "Resource Forbidden error",
            message: "Only agent can create this loan",
          },
        ];
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Payloads are invalid",
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
}; */

exports.createNewLoan = async (req, res) => {
  const result = { message: "Loan Created Successfully" };
  let status = 201;

  try {
    const {
      daysToRepay,
      borrowAmount,
      investAmount,
      interestPerDay,
      borrowCurrencyType,
      investCurrencyType,
    } = req.body;
    const payload = req.decoded;
    return res.status(status).json(result);
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
  const result = {};
  let status = 200;

  try {
    const payload = req.decoded;
    if (payload) {
      const loans = [...(await Loan.find({}))];
      result.data = loans;
      result.status = status;
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Payloads are invalid",
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
 * GET /v1/loan/:id
 * Return single loan entity from database
 */
exports.getLoan = async (req, res) => {
  const result = {};
  let status = 200;

  try {
    const payload = req.decoded;
    if (payload) {
      const loans = await Loan.findById(req.params.id);
      result.data = [loans];
      result.status = status;
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Payloads are invalid",
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
 * PUT /v1/loan/:id/approve
 * Update the loan status pending to approve
 */
exports.approveLoan = async (req, res) => {
  const result = {};
  let status = 200;

  try {
    const payload = req.decoded;
    if (payload) {
      if (payload.userRole === userRole.ADMIN) {
        const loan = await Loan.findByIdAndUpdate(
          req.params.id,
          {
            status: loanStatus.APPROVED,
          },
          { new: true }
        );
        if (!_.isEmpty(loan)) {
          result.data = [loan];
          result.status = status;
        } else {
          status = 400;
          result.errors = [
            {
              title: "Bad Request",
              message: "No loan application found for provided id",
            },
          ];
        }
      } else {
        status = 403;
        result.errors = [
          {
            title: "Resource Forbidden",
            message: "Only admin can approve the loan",
          },
        ];
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Payloads are invalid",
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
 * PUT /v1/loan/:id/rejct
 * Update the loan status from pending to rejected
 */
exports.rejectLoan = async (req, res) => {
  const result = {};
  let status = 200;

  try {
    const payload = req.decoded;
    if (payload) {
      const loan = await Loan.findByIdAndUpdate(
        req.params.id,
        {
          status: loanStatus.REJECTED,
        },
        { new: true }
      );
      if (!_.isEmpty(loan)) {
        result.data = [loan];
        result.status = status;
      } else {
        status = 400;
        result.errors = [
          {
            title: "Bad Request",
            message: "No loan application found for provided id",
          },
        ];
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Payloads are invalid",
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
