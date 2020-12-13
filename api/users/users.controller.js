const Joi = require("joi");
const userModel = require("./users.schema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

module.exports = class UsersControllers {
  static async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const passwordSalt = bcrypt.genSaltSync(10);
      const passwordHash = await bcrypt.hashSync(password, passwordSalt);
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        res.status(409).send("Email in use");
      }
      const user = await userModel.create({ email, password: passwordHash });
      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).send("No such email");
      }
      const passwordValidation = await bcrypt.compare(password, user.password);

      if (!passwordValidation) {
        return res.status(401).send("Password is incorrect, try again ");
      }

      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      await userModel.findByIdAndUpdate(user._id, { token: token });

      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.findByIdAndUpdate(user._id, null);
      return res.status(204).send("exit successfully");
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const { id, email, subscription } = req.user;
      res
        .status(200)
        .json({ id: id, email: email, subscription: subscription });
    } catch (err) {
      next();
    }
  }

  static validateUser(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = userRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing required field" });
    }
    next();
  }

  static async authorizeUser(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }
};
