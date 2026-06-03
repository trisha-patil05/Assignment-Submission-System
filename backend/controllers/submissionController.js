import stringSimilarity from 'string-similarity';
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { io } from "../server.js";
import sendEmail from "../utils/sendEmail.js";

const calculatePlagiarismScore = async (assignmentId, content) => {
  try {
    const otherSubmissions = await Submission.find({
      assignmentId,
      content: { $exists: true, $ne: "" }
    });

    if (otherSubmissions.length === 0) {
      return { score: 0, matchedWith: [] };
    }

    const matches = otherSubmissions
      .map(sub => ({
        submissionId: sub._id,
        studentName: sub.studentId?.name || "Unknown",
        similarity: Math.round(
          stringSimilarity.compareTwoStrings(
            content.toLowerCase(),
            (sub.content || "").toLowerCase()
          ) * 100
        )
      }))
      .filter(m => m.similarity > 30)
      .sort((a, b) => b.similarity - a.similarity);

    const maxScore = matches.length > 0 ? matches[0].similarity : 0;

    return {
      score: maxScore,
      matchedWith: matches.slice(0, 3)
    };
  } catch (err) {
    console.error("Plagiarism check error:", err);
    return { score: 0, matchedWith: [] };
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content, notes } = req.body;
    const studentId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check deadline and calculate if late
    let isLate = false;
    let minutesLate = 0;
    const now = new Date();

    if (assignment.deadline) {
      const deadlineTime = new Date(assignment.deadline);
      if (now > deadlineTime) {
        isLate = true;
        minutesLate = Math.round((now - deadlineTime) / (1000 * 60));
      }
    }

    const existing = await Submission.findOne({ assignmentId, studentId });

    let files = { document: "", image: "", video: "" };
    if (req.files?.length > 0) {
      req.files.forEach((file) => {
        const mime = file.mimetype;
        if (mime.startsWith("image/")) files.image = file.path;
        else if (mime.startsWith("video/")) files.video = file.path;
        else files.document = file.path;
      });
    }

    const student = await User.findById(studentId);

    if (!existing) {
      const submission = await Submission.create({
        assignmentId,
        studentId,
        content,
        notes: notes || "",
        files,
        status: "submitted",
        version: 1,
        isLate,        // ← NEW
        minutesLate,   // ← NEW
      });

      // Emit notification with late status
      io.to("mentor").emit("notification", {
        type: "submission",
        message: isLate 
          ? `⏰ ${student.name || student.email} submitted "${assignment.title}" (${minutesLate}min late)`
          : `📨 ${student.name || student.email} submitted "${assignment.title}"`,
        submissionId: submission._id,
        isLate,
        createdAt: new Date(),
      });

      return res.status(201).json({
        message: "Assignment submitted successfully",
        submission,
      });
    }

    existing.versions.push({
      versionNumber: existing.version,
      content: existing.content,
      notes: existing.notes || "",
      files: existing.files,
      submittedAt: existing.submittedAt,
    });

    existing.content = content;
    existing.notes = notes || "";
    existing.files = files;
    existing.version = existing.version + 1;
    existing.status = "submitted";
    existing.submittedAt = new Date();
    existing.isLate = isLate;        // ← NEW: Update late status on resubmit
    existing.minutesLate = minutesLate; // ← NEW

    await existing.save();

    io.to("mentor").emit("notification", {
      type: "resubmission",
      message: isLate
        ? `🔁 ${student.name || student.email} resubmitted "${assignment.title}" (${minutesLate}min late)`
        : `🔁 ${student.name || student.email} resubmitted "${assignment.title}"`,
      submissionId: existing._id,
      isLate,
      createdAt: new Date(),
    });

    return res.json({
      message: "Assignment resubmitted successfully",
      submission: existing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
};

export const reviewSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return res.status(400).json({ message: "Grade is required" });
    }

    if (grade < 0 || grade > 100) {
      return res.status(400).json({ message: "Grade must be between 0 and 100" });
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      {
        status: "reviewed",
        grade: Number(grade),
        feedback: feedback || "",
        reviewedAt: new Date(),
      },
      { new: true }
    )
      .populate("studentId", "name email")
      .populate("assignmentId", "title");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    io.to(submission.studentId._id.toString()).emit("notification", {
      type: "grade",
      message: `✅ "${submission.assignmentId.title}" was graded! You scored ${grade}/100`,
      grade: Number(grade),
      feedback: feedback || "",
      createdAt: new Date(),
    });

    try {
      await sendEmail(
        submission.studentId.email,
        "📊 Your Assignment Has Been Reviewed",
        `<h2>Hi ${submission.studentId.name},</h2>
         <p>Grade: <strong>${grade}/100</strong></p>
         <p>Feedback: ${feedback || "No feedback provided"}</p>`
      );
    } catch (emailErr) {
      console.log("Email skipped:", emailErr.message);
    }

    res.json({ message: "Reviewed successfully", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Review failed", error: err.message });
  }
};
 export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate("assignmentId");
    res.json(submissions);
  } catch (err) {
    console.error("getMySubmissions error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const user = req.user;
    let submissions;

    if (user.role === "mentor") {
      submissions = await Submission.find()
        .populate("studentId", "name email")
        .populate("assignmentId", "title deadline")
        .sort({ submittedAt: -1 });
    } else {
      submissions = await Submission.find({ studentId: user.id })
        .populate("assignmentId", "title description deadline")
        .sort({ submittedAt: -1 });
    }

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch", error: err.message });
  }
};

export const getSubmissionHistory = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submission = await Submission.findOne({
      assignmentId,
      studentId: req.user.id,
    }).populate("assignmentId", "title description deadline");

    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }

    res.json({
      current: {
        version: submission.version,
        content: submission.content,
        notes: submission.notes,
        files: submission.files,
        submittedAt: submission.submittedAt,
        status: submission.status,
        isLate: submission.isLate,      // ← NEW
        minutesLate: submission.minutesLate, // ← NEW
      },
      history: [...submission.versions].reverse(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submission history",
      error: err.message,
    });
  }
};