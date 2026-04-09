const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectsModel = new Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  demoLink: { type: String, required: true },
  githubLink: { type: String, required: false },
  tools: { type: [String], required: false, default: [] },
});

const projects = mongoose.model("projects", projectsModel);

module.exports = projects;
