import Stripe from "stripe";
import { Course } from "../models/course_model.js";
import { CoursePurchase } from "../models/purchaseCourse_model.js";
import { Lecture } from "../models/lecture_model.js";
import { User } from "../models/user_model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already purchased
    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course",
      });
    }

    // Create Stripe session first
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: { courseId, userId },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Failed to create checkout session",
      });
    }

    // Create purchase record AFTER session confirmed
    await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: session.id,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate("courseId");

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";
      await purchase.save();

      // Enroll user in course
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true },
      );

      // Add student to course
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true },
      );
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator", select: "name photoUrl" })
      .populate({ path: "lectures", select: "lectureTitle isPreviewFree" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.error("Error in getCourseDetailWithPurchaseStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course details",
    });
  }
};

// controller
export const getPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      purchased: !!purchase,
    });
  } catch (error) {
    console.error("Error in getPurchaseStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check purchase status",
    });
  }
};

export const getMyPurchasedCourses = async (req, res) => {
  try {
    const userId = req.id;

    const purchases = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate({
      path: "courseId",
      select: "courseTitle courseThumbnail category courseLevel creator",
      populate: {
        path: "creator",
        select: "name photoUrl",
      },
    });

    return res.status(200).json({
      success: true,
      purchases: purchases || [],
    });
  } catch (error) {
    console.error("Error in getMyPurchasedCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
    });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      success: true,
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error("Error in getAllPurchasedCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased courses",
    });
  }
};
