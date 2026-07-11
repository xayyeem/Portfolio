import express from "express";
import rateLimit from "express-rate-limit";
import { submitContactForm } from "../controllers/contact.controller.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

router.post("/", contactLimiter, submitContactForm);

export default router;