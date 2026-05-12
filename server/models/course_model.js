import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    subTitle: {
      type: String,
      trim: true,
      maxlength: [200, "Subtitle cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Medium", "Advance"],
    },
    coursePrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    courseThumbnail: {
      type: String,
      default: "",
    },
    courseThumbnailPublicId: {
      type: String,
      default: "",
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course must have a creator"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for frequently queried fields
courseSchema.index({ isPublished: 1 });
courseSchema.index({ creator: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ coursePrice: 1 });

export const Course = mongoose.model("Course", courseSchema);
