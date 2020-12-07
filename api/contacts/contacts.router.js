const express = require("express");
const ContactsControllers = require("./contacts.controller");
const contactsRouter = express.Router();

contactsRouter.get("/", ContactsControllers.getListContacts);

contactsRouter.get(
  "/:id",
  //   ContactsControllers.checkContact,
  ContactsControllers.getById
);
contactsRouter.post(
  "/",
  ContactsControllers.validateContact,
  ContactsControllers.create
);
contactsRouter.delete(
  "/:id",
  //   ContactsControllers.checkContact,
  ContactsControllers.remove
);
contactsRouter.patch(
  "/:id",
  //   ContactsControllers.checkContact,
  ContactsControllers.validateContact,
  ContactsControllers.update
);

module.exports = contactsRouter;
