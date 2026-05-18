import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },

  role: {
    type: String,
    enum: ["mentor", "student"],
    required: true,
  },

  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: { type: Date },
});

export default mongoose.model("User", userSchema);