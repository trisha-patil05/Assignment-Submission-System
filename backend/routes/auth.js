import express from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/profile", auth, async (req, res) => {
  try {
    const { profileImage, name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage, name },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;