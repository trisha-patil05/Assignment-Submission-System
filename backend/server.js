import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/submissionRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // ← wrap express

// Setup Socket.io
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
  },
});
// Socket connection handler
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // User joins their personal room
  socket.on("join", ({ userId, role }) => {
    socket.join(userId);          // personal room
    socket.join(role);            // "mentor" or "student" room
    socket.join("all_students");  // everyone room
    console.log(`✅ ${role} ${userId} joined rooms`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
}));
app.use(express.json());

// ENV CHECK
console.log("ENV CHECK:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ MISSING",
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

// ← changed app.listen to server.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));