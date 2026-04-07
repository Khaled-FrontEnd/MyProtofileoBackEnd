const express = require("express");
const router = express.Router();
const projects = require("../models/projects");

router.get("/", async (req, res) => {
  res.status(200).json(await projects.find());
});

router.post("/", async (req, res) => {
  //   let { img, name, description, demoLink, githubLink, tools } = req.body;
  try {
    let newSkill = await projects.create(req.body);
    res.status(200).json(newSkill);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "validation failed" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let upatedProject = await projects.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).send(upatedProject);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await projects.findOneAndDelete(req.params.id);
    res.status(201).send({ message: "Deleted Successful!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
