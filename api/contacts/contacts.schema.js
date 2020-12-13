const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: [true, "Field name is required"] },
  email: { type: String, required: [true, "Field email is required"] },
  phone: { type: String, required: [true, "Field phone is required"] },
  owner: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
});

const contactModel = mongoose.model("contact", contactSchema);

module.exports = contactModel;
