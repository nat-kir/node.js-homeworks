const Joi = require("joi");
const contactModel = require("./contacts.schema");

module.exports = class ContactsControllers {
  static async getListContacts(req, res, next) {
    const contactList = await contactModel.find({});
    return res.status(200).json(contactList);
  }

  static async getById(req, res, next) {
    const contact = await contactModel.findOne({ _id: req.params.id });
    if (contact) {
      return res.status(200).json(contact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  }

  static async create(req, res, next) {
    const contact = await contactModel.create(req.body);
    return res.status(201).json(contact);
  }

  static async remove(req, res, next) {
    const contact = await contactModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (contact) {
      return res.status(200).json(contact);
    } else {
      return res.status(404).json({ message: "Contact not found" });
    }
  }

  static async update(req, res, next) {
    const contact = await contactModel.findByIdAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    if (contact) {
      return res.status(200).json(contact);
    } else {
      return res.status(404).json({ message: "Contact not found" });
    }
  }

  static async validateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().optional(),
      password: Joi.string().required(),
    });
    const result = contactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }

  static async validateUpdateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().optional(),
      phone: Joi.string().optional(),
      subscription: Joi.string().optional(),
      password: Joi.string().optional(),
    }).min(1);
    const result = contactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing data" });
    }
    next();
  }
};
