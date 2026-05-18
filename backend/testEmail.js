import dotenv from "dotenv";
import sendEmail from "./utils/sendEmail.js";
dotenv.config();

sendEmail(
  "your_own_email@gmail.com",  // 👈 put your own email here
  "Test Email",
  "<h1>Email is working!</h1>"
).then(() => console.log("✅ Email sent!"))
 .catch((err) => console.log("❌ Failed:", err.message));
