import nodemailer from "nodemailer";

export const sendContactNotification = async ({
  name,
  email,
  company,
  projectType,
  budgetRange,
  message,
}) => {
  console.log("Starting email send...");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    console.log("Verifying SMTP...");
    await transporter.verify();
    console.log("SMTP verified successfully");

    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Project Type: ${projectType || "N/A"}
Budget: ${budgetRange || "N/A"}

Message:
${message}
      `,
    });

    console.log("EMAIL RESULT:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return info;
  } catch (error) {
    console.error("EMAIL SEND FAILED:", error);
    throw error;
  }
};