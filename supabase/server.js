import dotenv from "dotenv";

dotenv.config({
  path: "./supabase/.env",
});
    console.log("EMAIL_USER loaded:", !!process.env.EMAIL_USER);
console.log("EMAIL_APP_PASSWORD loaded:", !!process.env.EMAIL_APP_PASSWORD);
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();