export const sendContactNotification = async ({
  name,
  email,
  company,
  projectType,
  budgetRange,
  message,
}) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_APP_PASSWORD}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: [process.env.NOTIFY_EMAIL],
      reply_to: email,
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
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Resend error:", data);
    throw new Error(data.message || "Failed to send email");
  }

  console.log("Email sent successfully:", data);
  return data;
};