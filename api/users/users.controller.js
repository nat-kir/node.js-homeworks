const Joi = require("joi");
const userModel = require("./users.schema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const path = require("path");
const {
  сreateAvatar,
  imageMinify,
  removeAvatar,
  sendEmailToVerify,
} = require("./users.helpers");
const uuid = require("uuid");

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
      await сreateAvatar(email);
      await imageMinify();
      await removeAvatar(`${email}.png`);
      const verificationToken = uuid.v4();

      const user = await userModel.create({
        email,
        avatarURL: `http://localhost:${process.env.PORT}/images/${email}.png`,
        password: passwordHash,
        verificationToken: verificationToken,
      });

      await sendEmailToVerify(user.email, verificationToken);

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password, verified } = req.body;
      const user = await userModel.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(401).send("No such email");
      }
      const passwordValidation = await bcrypt.compare(password, user.password);

      if (!passwordValidation) {
        return res.status(401).send("Password is incorrect, try again ");
      }
      if (!user.verified) {
        return res.status(401).send("Your email is not verified");
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
      const { id, email, subscription, avatarURL } = req.user;
      res.status(200).json({
        id: id,
        email: email,
        subscription: subscription,
        avatarURL: avatarURL,
      });
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
  static validateUpdateUser(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().optional(),
      password: Joi.string().optional(),
      subscription: Joi.string().optional().valid("free", "pro", "premium"),
    }).min(1);
    const result = userRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "is not a valid value" });
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

  // Update current user
  static async updateCurrentUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }
  // Add Avatar
  static async addAvatar(req, res, next) {
    try {
      await imageMinify();
      await removeAvatar(req.file.filename);

      const user = await userModel.findByIdAndUpdate(
        req.user.id,
        {
          avatarURL: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ email: user.email, avatarURL: user.avatarURL });
    } catch (err) {
      next(err);
    }
  }

  // Emailing and TokenVerificatioin

  static async tokenVerification(req, res, next) {
    try {
      const { verificationToken } = req.params;
      console.log(verificationToken);

      const userToVerify = await userModel.findOne({ verificationToken });
      if (!userToVerify) {
        return res.status(404).json({ message: "User not found" });
      }
      verificationToken;

      await userModel.findByIdAndUpdate(
        userToVerify._id,
        { verified: true, verificationToken: null },
        { new: true }
      );

      return res.status(200).send("Your email confirmed");
    } catch (error) {
      next(error);
    }
  }
};
