const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillsModel = new Schema({
  img: { type: String, required: true},
  name: { type: String, required: true},
  color: { type: String},
  order: { type: Number, default: 0 }
});
  
const skills = mongoose.model("Skills", skillsModel);

module.exports = skills;