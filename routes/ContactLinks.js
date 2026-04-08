const express = require("express");
const router = express.Router();
const contactLinks = require("../models/contactLinks");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

router.get("/", async (req, res) => {
  res.status(200).json(await contactLinks.find());
});

router.post("/", async (req, res) => {
  //   let { img, name, description, demoLink, githubLink, tools } = req.body;
  try {
    let newContact = await contactLinks.create(req.body);
    res.status(200).json(newContact);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "validation failed" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let upatedContact = await contactLinks.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).send(upatedContact);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await contactLinks.findOneAndDelete(req.params.id);
    res.status(201).send({ message: "Deleted Successful!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/sendEmail", async (req, res) => {
  
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة",
      });
    }

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // مجاني بدون domain verification
      to: "k8320085@gmail.com",
      subject: `رسالة جديدة من ${name}`,
      html: `
        <h3>رسالة جديدة</h3>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد:</strong> ${email}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${message}</p>
      `,
      reply_to: email,
    });

    if (error) throw new Error(error.message);

    res.status(200).json({
      success: true,
      message: "تم إرسال رسالتك بنجاح! ✅",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "فشل الإرسال: " + error.message,
    });
  }
});
module.exports = router;
