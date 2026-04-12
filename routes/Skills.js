const express = require("express");
const router = express.Router();
const skills = require("../models/skills");

router.get("/", async (req, res) => {
  res.status(200).json(await skills.find());
});

router.post("/", async (req, res) => {

  let newSkill = await skills.create(req.body);
  res.status(200).json(newSkill);
});

router.delete("/:id", async (req, res) => {
  try {
    await skills.findOneAndDelete({ _id: req.params.id });
    res.status(201).send({ message: "Deleted Successful!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
