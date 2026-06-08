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
const server = http.createServer(app);

// Setup Socket.io
export const io = new Server(server, {  // ← ADD "export" HERE
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", ({ userId, role }) => {
    socket.join(userId);
    socket.join(role);
    socket.join("all_students");
    console.log(`✅ ${role} ${userId} joined rooms`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
}));
app.use(express.json());

console.log("ENV CHECK:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ MISSING",
});

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));