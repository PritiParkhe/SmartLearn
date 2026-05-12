import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishedCourse,
} from "../controllers/course_controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// ─────────────────────────────────────────
//  USER — Static
// ─────────────────────────────────────────
router.get("/published-courses", getPublishedCourse);
router.get("/search", isAuthenticated, searchCourse);

// ─────────────────────────────────────────
//  USER — Dynamic
// ─────────────────────────────────────────
router.get("/:courseId", isAuthenticated, getCourseById);
router.get("/:courseId/lecture", isAuthenticated, getCourseLecture);
router.get("/lecture/:lectureId", isAuthenticated, getLectureById);

// ─────────────────────────────────────────
//  INSTRUCTOR — Static
// ─────────────────────────────────────────
router.post("/", isAuthenticated, authorizeRole("instructor"), createCourse);
router.get(
  "/",
  isAuthenticated,
  authorizeRole("instructor"),
  getCreatorCourses,
);

// ─────────────────────────────────────────
//  INSTRUCTOR — Dynamic
// ─────────────────────────────────────────
router.post(
  "/:courseId/lecture",
  isAuthenticated,
  authorizeRole("instructor"),
  createLecture,
);
router.put(
  "/:courseId/lecture/:lectureId",
  isAuthenticated,
  authorizeRole("instructor"),
  editLecture,
);
router.put(
  "/:courseId",
  isAuthenticated,
  authorizeRole("instructor"),
  upload.single("courseThumbnail"),
  editCourse,
);
router.patch(
  "/:courseId",
  isAuthenticated,
  authorizeRole("instructor"),
  togglePublishedCourse,
);
router.delete(
  "/lecture/:lectureId",
  isAuthenticated,
  authorizeRole("instructor"),
  removeLecture,
);

export default router;
