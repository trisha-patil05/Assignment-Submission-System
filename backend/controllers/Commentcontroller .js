import Comment from "../models/Comment.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { io } from "../server.js";

// Get all comments for a submission
export const getComments = async (req, res) => {
  try {
    const { submissionId } = req.params;

    console.log("🔍 Getting comments for submission:", submissionId);

    const comments = await Comment.find({ submissionId })
      .populate("authorId", "name email")
      .populate("replies.authorId", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${comments.length} comments`);

    res.json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments", error: err.message });
  }
};

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { submissionId, content } = req.body;
    const authorId = req.user.id;

    console.log("💬 Creating comment:", { submissionId, authorId });

    if (!content || !submissionId) {
      return res.status(400).json({ message: "Content and submission ID required" });
    }

    // Get author info
    const author = await User.findById(authorId);
    
    // Create comment
    const comment = await Comment.create({
      submissionId,
      authorId,
      authorRole: author.role,
      content
    });

    // Populate author info
    await comment.populate("authorId", "name email");

    console.log("✅ Comment created:", comment._id);

    // Get submission to notify the other party
    const submission = await Submission.findById(submissionId);

    // Send notification
    if (author.role === "mentor") {
      // Mentor commented → notify student
      io.to(submission.studentId.toString()).emit("notification", {
        type: "comment",
        message: `💬 ${author.name} commented on your submission`,
        submissionId: submissionId,
        createdAt: new Date()
      });
    } else {
      // Student commented → notify mentor
      io.to(submission.studentId.toString()).emit("notification", {
        type: "comment",
        message: `💬 ${author.name} replied to your comment`,
        submissionId: submissionId,
        createdAt: new Date()
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Error creating comment:", err);
    res.status(500).json({ message: "Failed to create comment", error: err.message });
  }
};

// Reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    console.log("🔁 Replying to comment:", commentId);

    if (!content) {
      return res.status(400).json({ message: "Reply content required" });
    }

    const author = await User.findById(authorId);

    // Add reply to comment
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: {
            authorId,
            authorName: author.name,
            authorRole: author.role,
            content
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    ).populate("authorId", "name email")
     .populate("replies.authorId", "name email");

    console.log("✅ Reply added to comment:", commentId);

    // Notify original commenter
    const originalComment = await Comment.findById(commentId);
    io.to(originalComment.authorId.toString()).emit("notification", {
      type: "reply",
      message: `🔁 ${author.name} replied to your comment`,
      submissionId: originalComment.submissionId,
      createdAt: new Date()
    });

    res.json(comment);
  } catch (err) {
    console.error("❌ Error replying to comment:", err);
    res.status(500).json({ message: "Failed to reply to comment", error: err.message });
  }
};

// Delete comment (only creator or mentor can delete)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    console.log("🗑️ Deleting comment:", commentId);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is author or mentor
    if (comment.authorId.toString() !== userId && req.user.role !== "mentor") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    console.log("✅ Comment deleted:", commentId);

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
};

// Mark comment as resolved
export const resolveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { isResolved } = req.body;

    console.log("✅ Marking comment resolved:", commentId);

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isResolved },
      { new: true }
    ).populate("authorId", "name email");

    console.log("✅ Comment resolved status updated:", isResolved);

    res.json(comment);
  } catch (err) {
    console.error("❌ Error updating comment:", err);
    res.status(500).json({ message: "Failed to update comment", error: err.message });
  }
};

// Get comment count for submission
export const getCommentCount = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const count = await Comment.countDocuments({ submissionId });

    res.json({ count });
  } catch (err) {
    console.error("❌ Error getting comment count:", err);
    res.status(500).json({ message: "Failed to get comment count", error: err.message });
  }
};