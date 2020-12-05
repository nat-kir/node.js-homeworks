const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("./contacts.function");

module.exports = class ContactsControllers {
  static async getListContacts(req, res, next) {
    const contactList = await listContacts();
    return res.status(200).json(contactList);
  }

  static async getById(req, res, next) {
    const contact = await getContactById(req.params.id);
    if (contact) {
      return res.status(200).json(contact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  }

  static async create(req, res, next) {
    await addContact(req.body.name, req.body.email, req.body.phone);
    const contact = await listContacts();
    return res.status(201).json(contact[contact.length - 1]);
  }

  static async remove(req, res, next) {
    const contact = await removeContact(req.params.id);
    return res.status(200).json({ message: "Contact deleted" });
  }

  static async update(req, res, next) {
    await updateContact(req.params.id, req.body);
    return res.status(200).json(getContactById(req.params.id));
  }

  static async validateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const result = contactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }
  static async checkContact(req, res, next) {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id == req.params.id
    );
    if (contactIndex === -1) {
      return res.status(404).json({ message: "Not found contact" });
    }
    next();
  }
};
