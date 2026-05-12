import { CourseProgress } from "../models/courseProgress_model.js";
import { Course } from "../models/course_model.js";
import { CoursePurchase } from "../models/purchaseCourse_model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseDetails = await Course.findById(courseId).populate(
      "lectures",
      "lectureTitle videoUrl isPreviewFree",
    );

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseProgress = await CourseProgress.findOne({ courseId, userId });

    // no progress yet — return empty
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error in getCourseProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course progress",
    });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // verify purchase before tracking progress
    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "Please purchase this course to track progress",
      });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId,
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // check course completion
    const viewedCount = courseProgress.lectureProgress.filter(
      (lec) => lec.viewed,
    ).length;

    const course = await Course.findById(courseId).select("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.lectures.length === viewedCount) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.error("Error in updateLectureProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress",
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    // forEach for side effects — not map
    courseProgress.lectureProgress.forEach(
      (lecture) => (lecture.viewed = true),
    );
    courseProgress.completed = true;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed.",
    });
  } catch (error) {
    console.error("Error in markAsCompleted:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed",
    });
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.forEach(
      (lecture) => (lecture.viewed = false),
    );
    courseProgress.completed = false;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as incomplete.",
    });
  } catch (error) {
    console.error("Error in markAsInCompleted:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incomplete",
    });
  }
};
