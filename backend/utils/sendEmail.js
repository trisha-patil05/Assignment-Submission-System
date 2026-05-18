import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // ← must match .env key exactly
        pass: process.env.EMAIL_PASS,  // ← must match .env key exactly
      },
    });

    await transporter.sendMail({
      from: `"AssignmentHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message); // ← don't crash app on email fail
  }
};

export default sendEmail;