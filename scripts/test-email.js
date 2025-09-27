// scripts/test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // otomatis baca .env

// 🔍 Debug env
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "MISSING");

async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // gunakan 465 untuk SSL
    secure: true, // true = pakai SSL/TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection OK');

    // ✉️ Kirim email percobaan
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // kirim ke email sendiri dulu
      subject: 'Tes Nodemailer ✔',
      text: 'Halo! Ini adalah email tes dari Nodemailer di project Sistem Pendaftaran Kelas.',
    });

    console.log('📧 Email terkirim:', info.messageId);
  } catch (err) {
    console.error('❌ SMTP connection ERROR', err);
  }
}

main();
