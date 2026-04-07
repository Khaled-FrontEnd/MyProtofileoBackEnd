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
  service: "gmail",
  secure: true,
  auth: {
    user: "k8320085@gmail.com", // 👈 ايميلك اللي هتستقبل عليه الرسائل
    pass: "wsar byhv qazz jmsf", // 👈 باسورد التطبيق (مش باسورد الايميل العادي)
  },
});

// Endpoint استقبال البيانات وإرسالها لايميلك
router.post("/sendEmail", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // التحقق من البيانات
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "الاسم والبريد الإلكتروني والرسالة كلهم مطلوبين",
      });
    }

    // إعداد محتوى البريد اللي هتستقبله انت
    const mailOptions = {
      from: `"${name}" <${email}>`, // من (اللي مليء الفورم)
      to: "your-email@gmail.com", // 👈 لايميلك انت الشخصي
      subject: `رسالة جديدة من ${name}`, // موضوع البريد
      text: `
الاسم: ${name}
البريد الإلكتروني: ${email}
الرسالة: 
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>📬 رسالة جديدة من موقعك</h3>
          <p><strong>👤 الاسم:</strong> ${name}</p>
          <p><strong>📧 البريد:</strong> ${email}</p>
          <p><strong>💬 الرسالة:</strong></p>
          <p style="background: #f0f0f0; padding: 10px;">${message}</p>
        </div>
      `,
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);

    // رد للمستخدم
    res.status(200).json({
      success: true,
      message: "تم إرسال رسالتك بنجاح! هتوصلني خلال دقائق ✅",
    });
  } catch (error) {
    console.log("خطأ:", error);
    res.status(500).json({
      success: false,
      message: "عذراً، حدث خطأ تقني. حاول مرة تانية 🔧",
    });
  }
});

module.exports = router;
