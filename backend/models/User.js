import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },

  role: {
    type: String,
    enum: ["admin", "mentor", "student"],  // ← ADDED: admin
    required: true,
    default: "student"
  },

  // For blocking users
  isActive: { type: Boolean, default: true },
  blockedAt: { type: Date, default: null },
  blockedReason: { type: String, default: "" },

  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);