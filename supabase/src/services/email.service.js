import nodemailer from "nodemailer";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export const sendContactNotification = async ({
  name,
  email,
  company,
  projectType,
  budgetRange,
  message,
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
    },
  });

  const info = await transporter.sendMail({
    from: `"Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    text: message,
  });

  console.log("Email sent:", info.messageId);
};