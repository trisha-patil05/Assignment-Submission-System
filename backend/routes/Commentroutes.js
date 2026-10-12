import express from "express";
import {
    createComment,
    deleteComment,
    getCommentCount,
    getComments,
    replyToComment,
    resolveComment
} from "../controllers/commentController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get comments for submission
router.get("/submission/:submissionId", getComments);

// Get comment count
router.get("/count/:submissionId", getCommentCount);

// Create comment
router.post("/", createComment);

// Reply to comment
router.post("/:commentId/reply", replyToComment);

// Mark as resolved
router.patch("/:commentId/resolve", resolveComment);

// Delete comment
router.delete("/:commentId", deleteComment);

export default router;