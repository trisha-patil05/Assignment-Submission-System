import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import { io } from "../server.js"; // ← import socket

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Get mentor info
    const mentor = await User.findById(req.user.id);

    // 🔔 Notify ALL students instantly
    io.to("all_students").emit("notification", {
      type: "assignment",
      message: `📚 New assignment posted: "${assignment.title}"`,
      assignmentId: assignment._id,
      createdAt: new Date(),
    });

    console.log(`📢 Notified all students: new assignment "${assignment.title}"`);

    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create assignment", error: err.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch", error: err.message });
  }
};