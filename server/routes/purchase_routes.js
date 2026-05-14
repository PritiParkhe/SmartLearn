import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getMyPurchasedCourses,
  getPurchaseStatus,
  getCourseDetailWithPurchaseStatus,
} from "../controllers/coursePurschase_controller.js";

const router = express.Router();

// ── Webhook ──────────────────────────────────────────────

// ── Student routes ────────────────────────────────────────
router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

router.route("/my-courses").get(isAuthenticated, getMyPurchasedCourses);

router
  .route("/course/:courseId/status")
  .get(isAuthenticated, getPurchaseStatus);

router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);

// ── Instructor routes ────────────────────────────────────────
router
  .route("/")
  .get(isAuthenticated, authorizeRole("instructor"), getAllPurchasedCourse);

export default router;
