console.log("Loading index.js...");
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your provider's SMTP host
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an "App Password" for Gmail
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: 'sumitv2025@gmail.com',
      subject: `New Message from ${name}`,
      text: message,
    });
    res.status(200).send('Email sent!');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));