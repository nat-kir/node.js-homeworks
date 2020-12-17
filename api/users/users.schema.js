const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/;
      return re.test(String(value).toLowerCase());
    },
  },
  avatarURL: { type: String, required: false },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    message: "this type of subscription does not exist",
    default: "free",
  },
  token: { type: String, required: false, default: null },
  verified: {
    type: Boolean,
    required: false,
    default: false,
  },

  verificationToken: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
