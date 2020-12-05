// const express = require("express");
// const app = express();

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// app.listen(3000);

const argv = require("yargs").argv;

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require("./api/contacts/contacts.function");

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts();
      break;

    case "get":
      getContactById(id);
      break;

    case "add":
      addContact(name, email, phone);
      break;

    case "remove":
      removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}
invokeAction(argv);
