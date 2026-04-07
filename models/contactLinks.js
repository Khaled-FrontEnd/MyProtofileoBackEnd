const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactLinksModel = new Schema({
  platform: { type: String, required: true},
  link: { type: String, required: true},
});

const contactLinks = mongoose.model("contactLinks", contactLinksModel);

module.exports = contactLinks;