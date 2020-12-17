const express = require("express");
const UsersControllers = require("./users.controller");
const usersRouter = express.Router();
const { upload } = require("./users.helpers");

usersRouter.post(
  "/auth/register",
  UsersControllers.validateUser,
  UsersControllers.registration
);
usersRouter.get(
  "/auth/verify/:verificationToken",
  UsersControllers.tokenVerification
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
usersRouter.patch(
  "/avatar",
  UsersControllers.authorizeUser,
  upload.single("avatar"),
  UsersControllers.addAvatar
);

usersRouter.patch(
  "/:id",
  UsersControllers.authorizeUser,
  UsersControllers.validateUpdateUser,
  UsersControllers.updateCurrentUser
);

module.exports = usersRouter;
