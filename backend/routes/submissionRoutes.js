import express from "express";
import { upload } from "../config/cloudinary.js"; // ← only this, remove old upload import
import {
  getSubmissionHistory,
  getSubmissions,
  reviewSubmission,
  submitAssignment,
} from "../controllers/submissionController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// ← removed old: import upload from "../middleware/fileUpload.js"
// ← removed: const { upload } = require("../config/cloudinary")

router.post("/", auth, upload.array("files", 3), submitAssignment);
//                     ↑ array not single, matches req.files in controller

router.get("/my", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate("assignmentId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history/:assignmentId", auth, getSubmissionHistory);

router.get("/", auth, getSubmissions);
router.patch("/:id/review", auth, role("mentor"), reviewSubmission);

export default router;