import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    videoUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

lectureSchema.index({ courseId: 1 });

export const Lecture = mongoose.model("Lecture", lectureSchema);
