const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateLoginInputs } = require("../validation/login");
const { validateSignUpInputs } = require("../validation/signUp");
const { validateUserCreateORUpdateInputs } = require("../validation/user");

const _getHashedPassword = async (password) => {
  let hash = null;
  try {
    if (password) {
      const saltRound = 10;
      hash = await bcrypt.hash(password, saltRound);
    } else {
      throw new Error("password is undefined");
    }
  } catch (err) {
    console.error("Error hashing the password", err);
  }
  return hash;
};

const _createToken = async (userRole) => {
  let token = null;
  try {
    const payload = { userRole };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "2d" };

    token = await jwt.sign(payload, secret, options);
  } catch (err) {
    console.error(err);
  }
  return token;
};

/**
 * GET v1/user/:id
 * Return the user data
 */
exports.getUser = async (req, res) => {
  let result = {};
  let status = 200;

  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    result.data = user;
    result.status = status;
    res.status(status).json(result);
  } catch (err) {
    console.error(err);

    status = 500;
    result.status = status;
    result.error = err;
    res.status(status).json(result);
  }
};

/**
 * GET v1/users
 * Return all users from database
 */
exports.getUsers = async (req, res) => {
  let result = {};
  let status = 200;

  try {
    const payload = req.decoded;

    if (payload) {
      if (payload.userRole !== "admin") {
        const users = [...(await User.find({}))];
        result.data = users;
        result.status = status;
        res.status(status).json(result);
      } else {
        status = 403;
        result.status = status;
        result.error = "Only admin can access this resource";
        res.status(status).json(result);
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
      res.status(status).json(result);
    }
  } catch (err) {
    console.error(err);

    status = 500;
    result.status = status;
    result.errors = [
      {
        title: "Server error",
        message: "You may try again or wait till the error get resolve.",
      },
    ];
    res.status(status).json(result);
  }
};

/**
 *  POST v1/login
 *  login using email and password
 */
exports.postLogin = async (req, res) => {
  let result = {};
  let status = 201;

  try {
    // Validation check
    const { isValid, errors } = validateLoginInputs(req.body);
    if (!isValid) {
      status = 422;
      result.errors = errors;
      return res.status(status).json(result);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      //validate passoword
      const match = await bcrypt.compare(password, user.hashed_password);

      if (match) {
        //Create a token
        const accessToken = await _createToken(user.role);
        console.log();
        // Update newly generated token in db
        await User.findByIdAndUpdate(user._id, { access_token: accessToken });

        const { _id, type, full_name, role, access_token } = user;
        result.data = [{ _id, type, full_name, role, access_token }];
      } else {
        status = 401;
        result.errors = [
          {
            title: "Authentication error",
            message: "User password is invalid",
          },
        ];
      }
      res.status(status).json(result);
    } else {
      status = 401;
      result.errors = [
        {
          title: "Authentication error",
          message: "Provided email id is not registered",
        },
      ];
      res.status(status).json(result);
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
    res.status(status).json(result);
  }
};

/**
 *  POST v1/signup
 *  Create a new user account
 */
exports.postSignup = async (req, res) => {
  let result = {};
  let status = 201;

  try {
    // Validation check
    const { isValid, errors } = validateSignUpInputs(req.body);
    if (!isValid) {
      status = 422;
      result.errors = errors;
      return res.status(status).json(result);
    }

    let { first_name, last_name, password, email, role } = req.body;
    const hashed_password = await _getHashedPassword(password);
    role = role || "customer";

    const newUser = new User({
      first_name,
      last_name,
      email,
      hashed_password,
      role,
    });

    // Create a token
    const accessToken = await _createToken(newUser.role);
    newUser.access_token = accessToken;

    // save user
    await newUser.save();

    const { _id, type } = newUser;
    result.data = [{ _id, type }];
    res.status(status).json(result);
  } catch (err) {
    console.error(err);

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
    res.status(status).json(result);
  }
};

/**
 *  DELETE v1/user/:id
 *  Delete the user data
 */
exports.deleteUser = async (req, res) => {
  const result = {};
  let status = 204;

  try {
    const payload = req.decoded;
    if (payload) {
      if (payload.userRole !== "admin") {
        const { id } = req.params;
        const { deletedCount } = await User.deleteOne({ _id: id });
        if (deletedCount) {
          result.data = {};
          result.status = status;
        } else {
          status = 400;
          result.errors = [
            {
              title: "Bad Request",
              message: "No user found for provided id",
            },
          ];
        }
      } else {
        status = 403;
        result.status = status;
        result.error = "Only admin can delete the resource";
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Provided payloads are invalid",
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
 *  PUT v1/users/:id
 *  Update/Edit the user data
 */
exports.updateUser = async (req, res) => {
  const result = {};
  let status = 201;

  try {
    const payload = req.decoded;
    if (payload) {
      if (payload.userRole !== "admin") {
        const { id } = req.params;
        let { first_name, last_name, email, role } = req.body;

        const userData = await User.findOneAndUpdate(
          { _id: id },
          {
            first_name,
            last_name,
            email,
            role,
          },
          {
            new: true,
          }
        );
        if (userData) {
          result.data = [userData];
          result.status = status;
        } else {
          status = 400;
          result.errors = [
            {
              title: "Bad Request",
              message: "No user found for provided id",
            },
          ];
        }
      } else {
        status = 403;
        result.status = status;
        result.error = "Only admin can update the resource";
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Provided payloads are invalid",
        },
      ];
    }
  } catch (err) {
    console.log(err);
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
 * POST v1/users/
 * Create a new user
 */
exports.createUser = async (req, res) => {
  const result = {};
  let status = 201;

  try {
    const payload = req.decoded;
    if (payload) {
      if (payload.userRole !== "admin") {
        const { isValid, errors } = validateUserCreateORUpdateInputs(req.body);

        if (!isValid) {
          status = 422;
          result.errors = errors;
          return res.status(status).json(result);
        }

        let { first_name, last_name, email, role } = req.body;

        const newUser = new User({
          first_name,
          last_name,
          email,
          role,
        });

        //save new user
        await newUser.save();

        result.data = [newUser];
        result.status = status;
      } else {
        status = 403;
        result.status = status;
        result.error = "Only admin can create the new user";
      }
    } else {
      status = 400;
      result.status = status;
      result.errors = [
        {
          title: "Bad Request",
          message: "Provided payloads are invalid",
        },
      ];
    }
  } catch (err) {
    console.log(err);

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
