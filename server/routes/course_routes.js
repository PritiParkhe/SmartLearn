import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCourse } from "../controllers/course_controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated,createCourse);

export default router;
