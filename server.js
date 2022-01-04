import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
import express from "express";
const app = express();
const { PORT = 3000, GMAIL_PASS, MAIL_SENDER, MAIL_RECIPIENT } = process.env;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "notsecure28@gmail.com",
    pass: GMAIL_PASS,
  },
});

app.post("/sendmail", (req, res) => {
  try {
    if (
      !(
        req.body.customerName &&
        req.body.customerEmail &&
        req.body.customerPhone &&
        req.body.customerMsg
      )
    ) {
      res.status(400).json({ msg: "bad request, some fields might be missing" });
    }

    const mailOptions = {
      to: MAIL_RECIPIENT,
      subject: "Invoices due",
      text: "Dudes, we really need your money.",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);

        res.status(200).json({
          msg: "success",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
