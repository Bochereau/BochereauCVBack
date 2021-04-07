const express = require('express');
const nodemailer = require('nodemailer');

require("dotenv").config();

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.post('/contact', async (req, res) => {
  const {
    name,
    email,
    message
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: process.env.MAIL_ADDRESS,
    subject: "Contact CV",
    html: `
      <p>Nouvel email du site CV</p>
      <h2>Details</h2>
      <ul>
        <li>Nom: ${name}</li>
        <li>Email: ${email}</li>
      </ul>
      <h2>Message :</h2>
      <p>${message}</p>
    `, // A revoir pour envoyez name / message /email  (exemple : `<h1>${email}</h1>`)
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({status: 'erreur'});
    }
  });
  // send a validation email to the prospect
  // sendValidationMail(prospect)
  return res.status(201).json({status: 'succes'});
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start at http://localhost:${PORT};`))
