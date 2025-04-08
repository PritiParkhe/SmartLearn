import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/coursePurschase_controller.js";
const router = express.Router();

router.route("/checout/create-checkout-session").post(isAuthenticated, createCheckoutSession)
router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook)
router.route("/course/:courseId/detail-with-status").get();

router.route("/").get()
export default router;
