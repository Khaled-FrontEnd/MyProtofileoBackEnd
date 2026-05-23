const express = require("express");
const router = express.Router();
const skills = require("../models/skills");

router.get("/", async (req, res) => {
  res.status(200).json(await skills.find().sort({ order: 1 }));
});

router.post("/", async (req, res) => {
  let newSkill = await skills.create(req.body);
  res.status(200).json(newSkill);
});

// ✅ لازم يكون قبل /:id
router.patch("/reorder", async (req, res) => {
  const { id, newIndex } = req.body;
  try {
    const allSkills = await skills.find().sort({ order: 1 });
    const currentIndex = allSkills.findIndex((s) => s._id.toString() === id);
    if (currentIndex === -1)
      return res.status(404).json({ message: "Skill not found" });

    const [moved] = allSkills.splice(currentIndex, 1);
    allSkills.splice(newIndex, 0, moved);

    const bulkOps = allSkills.map((skill, index) => ({
      updateOne: {
        filter: { _id: skill._id },
        update: { $set: { order: index } },
      },
    }));

    await skills.bulkWrite(bulkOps);
    res.status(200).json({ message: "Reordered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
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