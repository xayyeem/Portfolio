import nodemailer from "nodemailer";

export const sendContactNotification = async ({
  name,
  email,
  company,
  projectType,
  budgetRange,
  message,
}) => {
  console.log("Email credentials:", {
    user: !!process.env.EMAIL_USER,
    password: !!process.env.EMAIL_APP_PASSWORD,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ""}
      ${budgetRange ? `<p><strong>Budget:</strong> ${budgetRange}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });

  console.log("Email sent successfully:", info.messageId);
  return info;
};