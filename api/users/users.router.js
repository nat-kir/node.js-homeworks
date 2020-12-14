const express = require("express");
const UsersControllers = require("./users.controller");
const usersRouter = express.Router();

usersRouter.post(
  "/auth/register",
  UsersControllers.validateUser,
  UsersControllers.registration
);
usersRouter.post(
  "/auth/login",
  UsersControllers.validateUser,
  UsersControllers.login
);
usersRouter.post(
  "/auth/logout",
  UsersControllers.authorizeUser,
  UsersControllers.logout
);
usersRouter.get(
  "/current",
  UsersControllers.authorizeUser,
  UsersControllers.getCurrentUser
);

module.exports = usersRouter;
