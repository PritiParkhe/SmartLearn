import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getMyPurchasedCourses,
  getPurchaseStatus,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/coursePurchase_controller.js";

const router = express.Router();

// ── Webhook ──────────────────────────────────────────────
router.route("/webhook").post(stripeWebhook);

// ── Student routes ────────────────────────────────────────
router.route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

router.route("/my-courses")
  .get(isAuthenticated, getMyPurchasedCourses);

router.route("/course/:courseId/status")
  .get(isAuthenticated, getPurchaseStatus);

router.route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);

// ── Admin routes ──────────────────────────────────────────
router.route("/")
  .get(isAuthenticated, authorizeRole("admin"), getAllPurchasedCourse);

export default router;
