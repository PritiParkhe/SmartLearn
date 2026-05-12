import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: "", // set after Stripe session creation
    },
  },
  { timestamps: true }
);

// indexes for frequent queries
coursePurchaseSchema.index({ userId: 1, courseId: 1 });
coursePurchaseSchema.index({ status: 1 });
coursePurchaseSchema.index({ paymentId: 1 }); 

export const CoursePurchase = mongoose.model("Purchase", coursePurchaseSchema);
