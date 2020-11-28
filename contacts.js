const fs = require("fs");
const path = require("path");
const contactsPath = path.join(__dirname, "./db/contacts.json");
const { v1: uuidv1 } = require("uuid");

function listContacts() {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const filteredContacts = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts), (err) => {
      if (err) throw err;
    });
  });
}

function addContact(name, email, phone) {
  const oldContactList = require(contactsPath);
  const newContact = { id: uuidv1(), name: name, email: email, phone: phone };
  const newContactList = [...oldContactList, newContact];

  fs.writeFile(contactsPath, JSON.stringify(newContactList), (err) => {
    if (err) throw err;
  });
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
