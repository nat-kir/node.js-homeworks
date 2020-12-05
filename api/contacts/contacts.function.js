const fs = require("fs");
const path = require("path");
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const { v1: uuidv1 } = require("uuid");
const { promises: fsPromises } = fs;

async function listContacts() {
  try {
    return JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
  } catch (err) {
    throw err;
  }
}

function getContactById(contactId) {
  return require(contactsPath).find((contact) => contact.id == contactId);
}

async function removeContact(contactId) {
  try {
    const removedContact = require(contactsPath).filter(
      (contact) => contact.id != contactId
    );
    await fsPromises.writeFile(contactsPath, JSON.stringify(removedContact));
  } catch (err) {
    throw err;
  }
}

async function addContact(name, email, phone) {
  try {
    const contactList = require(contactsPath);
    const newContactList = [
      ...contactList,
      {
        id: uuidv1(),
        name: name,
        email: email,
        phone: phone,
      },
    ];
    await fsPromises.writeFile(contactsPath, JSON.stringify(newContactList));
  } catch (err) {
    throw err;
  }
}

async function updateContact(contactId, newData) {
  try {
    const contactList = require(contactsPath);
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id == contactId
    );
    contactList[contactIndex] = Object.assign(
      contactList[contactIndex],
      newData
    );
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactList));
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
