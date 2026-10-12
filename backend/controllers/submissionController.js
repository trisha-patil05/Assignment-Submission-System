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

    console.log("📤 Submit:", { assignmentId, studentId, contentLen: content?.length });

    if (!assignmentId || !content) {
      return res.status(400).json({ message: "Assignment ID and content required" });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate("createdBy", "name email");
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

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
    const mentor = assignment.createdBy;

    if (!existing) {
      const submission = await Submission.create({
        assignmentId,
        studentId,
        content,
        notes: notes || "",
        files,
        status: "submitted",
        version: 1,
        isLate,
        minutesLate,
      });

      console.log("✅ Submission created:", submission._id);

      io.to("mentor").emit("notification", {
        type: "submission",
        message: isLate 
          ? `⏰ ${student.name || student.email} submitted "${assignment.title}" (${minutesLate}min late)`
          : `📨 ${student.name || student.email} submitted "${assignment.title}"`,
        submissionId: submission._id,
        isLate,
        createdAt: new Date(),
      });

      try {
        const emailHTML = `
          <h2>📨 New Submission Received!</h2>
          <p>Hi ${mentor.name},</p>
          <p><strong>${student.name}</strong> has submitted the assignment:</p>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>${assignment.title}</h3>
            <p><strong>Student:</strong> ${student.email}</p>
            <p><strong>Submission Status:</strong> ${isLate ? `⏰ LATE (${minutesLate} minutes)` : '✅ ON TIME'}</p>
            <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please log in to AssignmentHub to review and grade this submission.</p>
          <p>Best regards,<br>AssignmentHub Team</p>
        `;

        await sendEmail(
          mentor.email,
          `📨 New Submission: ${assignment.title} by ${student.name}`,
          emailHTML
        );
        console.log(`✅ Email sent to mentor ${mentor.email}`);
      } catch (emailErr) {
        console.error("❌ Error sending email to mentor:", emailErr.message);
      }

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
    existing.isLate = isLate;
    existing.minutesLate = minutesLate;

    await existing.save();

    console.log("🔁 Resubmission updated:", existing._id);

    io.to("mentor").emit("notification", {
      type: "resubmission",
      message: isLate
        ? `🔁 ${student.name || student.email} resubmitted "${assignment.title}" (${minutesLate}min late)`
        : `🔁 ${student.name || student.email} resubmitted "${assignment.title}"`,
      submissionId: existing._id,
      isLate,
      createdAt: new Date(),
    });

    try {
      const emailHTML = `
        <h2>🔁 Resubmission Received!</h2>
        <p>Hi ${mentor.name},</p>
        <p><strong>${student.name}</strong> has resubmitted the assignment (Version ${existing.version}):</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>${assignment.title}</h3>
          <p><strong>Student:</strong> ${student.email}</p>
          <p><strong>Submission Status:</strong> ${isLate ? `⏰ LATE (${minutesLate} minutes)` : '✅ ON TIME'}</p>
          <p><strong>Version:</strong> ${existing.version}</p>
          <p><strong>Resubmitted at:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Please log in to AssignmentHub to review and grade this resubmission.</p>
        <p>Best regards,<br>AssignmentHub Team</p>
      `;

      await sendEmail(
        mentor.email,
        `🔁 Resubmission: ${assignment.title} by ${student.name} (Version ${existing.version})`,
        emailHTML
      );
      console.log(`✅ Resubmission email sent to mentor ${mentor.email}`);
    } catch (emailErr) {
      console.error("❌ Error sending resubmission email:", emailErr.message);
    }

    return res.json({
      message: "Assignment resubmitted successfully",
      submission: existing,
    });
  } catch (err) {
    console.error("❌ Submit error:", err);
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
      const emailHTML = `
        <h2>✅ Your Assignment Has Been Graded!</h2>
        <p>Hi ${submission.studentId.name},</p>
        <p>Your assignment has been reviewed and graded:</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>${submission.assignmentId.title}</h3>
          <p style="font-size: 24px; color: #4CAF50;"><strong>Grade: ${grade}/100</strong></p>
          ${feedback ? `<p><strong>Feedback:</strong></p><p>${feedback}</p>` : '<p>No additional feedback provided.</p>'}
        </div>
        
        <p>Please log in to AssignmentHub to view more details.</p>
        <p>Best regards,<br>AssignmentHub Team</p>
      `;

      await sendEmail(
        submission.studentId.email,
        `✅ Assignment Graded: ${submission.assignmentId.title} - ${grade}/100`,
        emailHTML
      );
      console.log(`✅ Grade email sent to student ${submission.studentId.email}`);
    } catch (emailErr) {
      console.error("❌ Error sending grade email:", emailErr.message);
    }

    res.json({ message: "Reviewed successfully", submission });
  } catch (err) {
    console.error("❌ Review error:", err);
    res.status(500).json({ message: "Review failed", error: err.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    console.log("🔍 Getting my submissions for:", req.user.id);
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate("assignmentId", "title deadline description");
    console.log("✅ Found:", submissions.length, "submissions");
    res.json(submissions);
  } catch (err) {
    console.error("❌ getMySubmissions error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const user = req.user;
    const { search, status, sortBy, sortOrder } = req.query;

    console.log("🔍 Getting submissions with filters:", { search, status, sortBy, sortOrder });

    if (!user || !user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let filter = {};
    let submissions;

    if (user.role === "mentor") {
      // Mentor can see all submissions with filters
      if (search) {
        filter = {
          $or: [
            { "studentId.name": { $regex: search, $options: "i" } },
            { "studentId.email": { $regex: search, $options: "i" } },
            { "assignmentId.title": { $regex: search, $options: "i" } }
          ]
        };
      }

      if (status) {
        filter.status = status;
      }

      let sortQuery = { submittedAt: -1 }; // Default: newest first
      if (sortBy) {
        const order = sortOrder === "asc" ? 1 : -1;
        
        if (sortBy === "studentName") {
          sortQuery = { "studentId.name": order };
        } else if (sortBy === "grade") {
          sortQuery = { grade: order };
        } else if (sortBy === "date") {
          sortQuery = { submittedAt: order };
        } else if (sortBy === "status") {
          sortQuery = { status: order };
        }
      }

      submissions = await Submission.find(filter)
        .populate("studentId", "name email")
        .populate("assignmentId", "title deadline")
        .sort(sortQuery);
        
      console.log("✅ Mentor: Found", submissions.length, "submissions");
    } else {
      // Student can only see their own submissions
      if (search) {
        filter = {
          "assignmentId.title": { $regex: search, $options: "i" }
        };
      }

      if (status) {
        filter.status = status;
      }

      let sortQuery = { submittedAt: -1 };
      if (sortBy) {
        const order = sortOrder === "asc" ? 1 : -1;
        
        if (sortBy === "title") {
          sortQuery = { "assignmentId.title": order };
        } else if (sortBy === "date") {
          sortQuery = { submittedAt: order };
        }
      }

      filter.studentId = user.id;

      submissions = await Submission.find(filter)
        .populate("assignmentId", "title description deadline")
        .sort(sortQuery);
        
      console.log("✅ Student: Found", submissions.length, "submissions");
    }

    res.json(submissions);
  } catch (err) {
    console.error("❌ getSubmissions error:", err);
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
        isLate: submission.isLate,
        minutesLate: submission.minutesLate,
      },
      history: [...submission.versions].reverse(),
    });
  } catch (err) {
    console.error("❌ getSubmissionHistory error:", err);
    res.status(500).json({
      message: "Failed to fetch submission history",
      error: err.message,
    });
  }
};