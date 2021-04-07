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

  const mailOwner = {
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
    `,
  };
  transporter.sendMail(mailOwner, (error) => {
    if (error) {
      return res.status(500).json({status: 'erreur'});
    }
  });

  const mailUser = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: "Accusé de réception de votre demande",
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Merci d'avoir pris le temps de me contacter.</p>
      <p>Je reviens vers vous au plus vite !</p>
      <p>Cordialement,</p>
      <h3>Bochereau Antoine</h3>
    `,
  };
  transporter.sendMail(mailUser, (error) => {
    if (error) {
      return res.status(500).json({status: 'erreur'});
    }
  });
  // sendValidationMail in network
  return res.status(201).json({status: 'succes'});
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start at http://localhost:${PORT};`))
