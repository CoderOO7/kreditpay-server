const mongoose = require("mongoose");
const validator = require("validator");
const { userRole } = require("../utils/user");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate: (value) => validator.isEmail(value),
    },
    hashed_password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "customer",
      enum: [userRole.ADMIN, userRole.CUSTOMER, userRole.AGENT],
    },
    access_token: {
      type: String,
    },
  },
  { timestamps: true }
);

// Virtual for User full name
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Virutual for User url
userSchema.virtual("url").get(function () {
  return `catalog/user/${this._id}`;
});

// Virutual for User type
userSchema.virtual("type").get(() => "user");

// Path for validation of unique email
userSchema.path("email").validate(async (value) => {
  const emailCount = await mongoose.model("User").count({ email: value });
  return !emailCount; // if count greater than zero invalidate
}, "Email already exists");

const User = new mongoose.model("User", userSchema);

module.exports = User;
