import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  files: {
    document: { type: String, default: "" },
    image:    { type: String, default: "" },
    video:    { type: String, default: "" },
  },
  content: {
    type: String,
    default: "",
  },

notes: {
  type: String,
  default: "",
},
version: {
  type: Number,
  default: 1,
},
versions: [
  {
    versionNumber: { type: Number, required: true },
    content: { type: String, default: "" },
    notes: { type: String, default: "" },
    files: {
      document: { type: String, default: "" },
      image: { type: String, default: "" },
      video: { type: String, default: "" },
    },
    submittedAt: { type: Date, default: Date.now },
  },
],

  status: {
    type: String,
    enum: ["pending", "submitted", "reviewed"],
    default: "pending",
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  feedback: {
    type: String,
    default: "",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });   // ← ADD this for createdAt/updatedAt

export default mongoose.model("Submission", submissionSchema);