import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import { io } from "../server.js";
import sendEmail from "../utils/sendEmail.js";

export const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    console.log("📝 Creating assignment:", { title, createdBy: req.user.id });

    const assignment = await Assignment.create({
      title,
      description,
      deadline: deadline || null,
      createdBy: req.user.id,
    });

    console.log("✅ Assignment created:", assignment._id);

    const mentor = await User.findById(req.user.id);

    io.to("all_students").emit("notification", {
      type: "assignment",
      message: `📚 New assignment posted: "${assignment.title}"`,
      assignmentId: assignment._id,
      createdAt: new Date(),
    });

    console.log(`📢 Socket notified all students: new assignment "${assignment.title}"`);

    try {
      const allStudents = await User.find({ role: "student" });
      console.log(`📧 Found ${allStudents.length} students, sending emails...`);

      for (const student of allStudents) {
        const emailHTML = `
          <h2>📚 New Assignment Posted!</h2>
          <p>Hi ${student.name},</p>
          <p>A new assignment has been posted by <strong>${mentor.name}</strong>:</p>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>${assignment.title}</h3>
            <p>${assignment.description}</p>
            ${assignment.deadline ? `<p><strong>Deadline:</strong> ${new Date(assignment.deadline).toLocaleDateString()}</p>` : ''}
          </div>
          
          <p>Please log in to AssignmentHub and submit your work before the deadline.</p>
          <p>Best regards,<br>AssignmentHub Team</p>
        `;

        await sendEmail(
          student.email,
          `📚 New Assignment: ${assignment.title}`,
          emailHTML
        );
      }

      console.log(`✅ Emails sent to ${allStudents.length} students`);
    } catch (emailErr) {
      console.error("❌ Error sending emails to students:", emailErr.message);
    }

    res.status(201).json(assignment);
  } catch (err) {
    console.error("❌ createAssignment error:", err);
    res.status(500).json({ message: "Failed to create assignment", error: err.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    console.log("🔍 Getting assignments with filters:", { search, sortBy, sortOrder });

    // Build filter query
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    // Build sort query
    let sortQuery = { createdAt: -1 }; // Default: newest first

    if (sortBy) {
      const order = sortOrder === "asc" ? 1 : -1;
      
      if (sortBy === "title") {
        sortQuery = { title: order };
      } else if (sortBy === "deadline") {
        sortQuery = { deadline: order === 1 ? 1 : -1 };
      } else if (sortBy === "date") {
        sortQuery = { createdAt: order };
      }
    }

    const assignments = await Assignment.find(filter)
      .populate("createdBy", "name email")
      .sort(sortQuery);

    console.log(`✅ Found ${assignments.length} assignments`);

    res.json(assignments);
  } catch (err) {
    console.error("❌ getAssignments error:", err);
    res.status(500).json({ message: "Failed to fetch", error: err.message });
  }
};