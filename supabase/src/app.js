import express from "express";
import cors from "cors";
import helmet from "helmet";

import contactRoutes from "./routes/contact.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/contact", contactRoutes);

app.use(errorHandler);

export default app;