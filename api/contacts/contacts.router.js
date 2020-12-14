const express = require("express");
const ContactsControllers = require("./contacts.controller");
const contactsRouter = express.Router();

contactsRouter.get("/", ContactsControllers.getListContacts);

contactsRouter.get("/:id", ContactsControllers.getById);
contactsRouter.post(
  "/",
  ContactsControllers.validateContact,
  ContactsControllers.create
);
contactsRouter.delete("/:id", ContactsControllers.remove);
contactsRouter.patch(
  "/:id",
  ContactsControllers.validateUpdateContact,
  ContactsControllers.update
);

module.exports = contactsRouter;
