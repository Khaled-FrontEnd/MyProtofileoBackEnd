const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillsModel = new Schema({
  img: { type: String, required: true},
  name: { type: String, required: true},
});

const skills = mongoose.model("Skills", skillsModel);

module.exports = skills;