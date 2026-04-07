const express = require("express");
const router = express.Router();
const skills = require("../models/skills");

router.get("/", async (req, res) => {
  res.status(200).json(await skills.find());
});

router.post("/", async (req, res) => {
  let { img, name } = req.body;
  let newSkill = await skills.create({ name: name, img: img });
  res.status(200).json(newSkill);
});

router.delete("/:id", async (req, res) => {
  try {
    await skills.findOneAndDelete(req.params.id);
    res.status(201).send({ message: "Deleted Successful!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
