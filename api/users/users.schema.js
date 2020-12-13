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
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    message: "this type of sunscription does not exist",
    default: "free",
  },
  token: { type: String, required: false, default: null },
});

// userSchema.methods.setPassword = function (password) {
//   this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
// };

// userSchema.methods.validPassword = function (password) {
//   return bCrypt.compareSync(password, this.password);
// };

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
