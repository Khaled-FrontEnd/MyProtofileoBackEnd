const express = require("express");
const router = express.Router();
const contactLinks = require("../models/contactLinks");
const nodemailer = require("nodemailer");

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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
});

// Endpoint إرسال البريد
router.post("/sendEmail", async (req, res) => {
  // رد فوري لمنع التعليق
  let emailSent = false;

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة",
      });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "k8320085@gmail.com", // غيرها لايميلك
      subject: `رسالة جديدة من ${name}`,
      text: `الاسم: ${name}\nالبريد: ${email}\nالرسالة: ${message}`,
      html: `<h3>رسالة جديدة</h3><p><strong>الاسم:</strong> ${name}</p><p><strong>البريد:</strong> ${email}</p><p><strong>الرسالة:</strong></p><p>${message}</p>`,
    };

    // إرسال البريد مع timeout
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout after 15 seconds")), 15000);
    });

    await Promise.race([emailPromise, timeoutPromise]);
    emailSent = true;

    res.status(200).json({
      success: true,
      message: "تم إرسال رسالتك بنجاح! ✅",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: emailSent
        ? "تم الإرسال لكن حدث تأخير"
        : "فشل الإرسال: " + error.message,
    });
  }
});

module.exports = router;
