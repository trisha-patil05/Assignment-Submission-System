import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorRole: {
    type: String,
    enum: ["mentor", "student"],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  replies: [
    {
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      authorName: String,
      authorRole: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  isResolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Comment", commentSchema);