import express from "express";
import {
    createAssignment,
    getAssignments,
} from "../controllers/assignmentController.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", auth, role("mentor"), createAssignment);
router.get("/", auth, getAssignments);

export default router;
