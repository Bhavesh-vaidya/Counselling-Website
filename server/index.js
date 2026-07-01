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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your 16-character App Password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Archi Website" <${process.env.EMAIL_USER}>`,
      to: 'sumitv2025@gmail.com',
      subject: `New Message from ${name}`,
      text: `
        You have received a new inquiry from your website.

        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    });
    console.log("Email sent successfully!");
    res.status(200).send('Email sent!');
  } catch (error) {
    console.error("SMTP ERROR:", error);
    res.status(500).send(error.toString());
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));