import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} from "../controllers/courseProgress_controller.js";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);

router
  .route("/:courseId/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);

router.route("/:courseId/complete").patch(isAuthenticated, markAsCompleted); 

router.route("/:courseId/incomplete").patch(isAuthenticated, markAsInCompleted); 

export default router;
