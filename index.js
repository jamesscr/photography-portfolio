const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// Serve static files from the root directory (for HTML files)
app.use(express.static(path.join(__dirname)));

// Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Routes
app.post("/send-email", (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL}>`,
    to: "allanjeanjacques@gmail.com",
    subject: `New Contact Form Message: ${subject}`,
    text: `
From: ${email}
Subject: ${subject}

Message:
${message}
    `,
    html: `
    <h2>New Contact Form Message</h2>
    <p><strong>From:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// Catch-all route to serve the main HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
