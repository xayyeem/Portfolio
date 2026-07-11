import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotification } from "../services/email.service.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const {
      name,
      email,
      company,
      project_type,
      budget_range,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Message must be at least 10 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Max 3 messages from the same email within one hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const messageCount = await ContactMessage.countDocuments({
      email: normalizedEmail,
      createdAt: {
        $gte: oneHourAgo,
      },
    });

    if (messageCount >= 3) {
      return res.status(429).json({
        success: false,
        error: "Too many messages. Please try again later.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: normalizedEmail,
      company: company?.trim() || null,
      projectType: project_type || null,
      budgetRange: budget_range || null,
      message: message.trim(),
    });

    // Don't fail contact submission if email notification fails
    sendContactNotification({
      name: contactMessage.name,
      email: contactMessage.email,
      company: contactMessage.company,
      projectType: contactMessage.projectType,
      budgetRange: contactMessage.budgetRange,
      message: contactMessage.message,
    }).catch((error) => {
      console.error("Email notification failed:", error);
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
      id: contactMessage._id,
    });
  } catch (error) {
    next(error);
  }
};