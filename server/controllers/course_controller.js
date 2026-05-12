import mongoose from "mongoose";
import { Course } from "../models/course_model.js";
import { Lecture } from "../models/lecture_model.js";
import {
  deleteVideoFromCloudinary,
  deleteMediaFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import fs from "fs";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching published courses:", error.message);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    const thumbnail = req.file; // this is the uploaded file

    // Find the course
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Default to existing thumbnail
    let courseThumbnail = course.courseThumbnail;
    let courseThumbnailPublicId = course.courseThumbnailPublicId;

    // If a new thumbnail was uploaded
    if (thumbnail) {
      // Delete the old thumbnail from Cloudinary
      if (course.courseThumbnailPublicId) {
        await deleteMediaFromCloudinary(course.courseThumbnailPublicId);
      }

      try {
        const uploaded = await uploadMedia(thumbnail.path);
        courseThumbnail = uploaded.secure_url;
        courseThumbnailPublicId = uploaded.public_id;
      } finally {
        if (thumbnail?.path && fs.existsSync(thumbnail.path)) {
          fs.unlinkSync(thumbnail.path);
        }
      }
    }

    // Prepare update data, with validation
    const updateData = {
      ...(courseTitle && { courseTitle }),
      ...(subTitle && { subTitle }),
      ...(description && { description }),
      ...(category && { category }),
      ...(courseLevel && { courseLevel }),
      ...(coursePrice !== undefined &&
        !isNaN(Number(coursePrice)) && { coursePrice: Number(coursePrice) }),
      ...(courseThumbnail && { courseThumbnail }),
      ...(courseThumbnailPublicId && { courseThumbnailPublicId }),
    };

    // Update the course
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error.message);
    return res.status(500).json({
      message: "Failed to get course by id",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(400).json({ message: "Lecture title is required" });
    }
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create lecture
    const lecture = await Lecture.create({ lectureTitle, courseId });

    // Associate lecture with course
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure course still has the lecture id if it was not already added
    const course = await Course.findById(courseId);
    if (course && !course.lectures.some((id) => id.equals(lecture._id))) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to edit lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    // delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    // remove lecture reference from associated course
    await Course.updateOne(
      {
        lectures: lectureId,
      }, // find the course contens lecture
      {
        $pull: { lectures: lectureId }, // remove the lecture id from the lecture array
      },
    );

    return res.status(200).json({
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get lecture by id",
    });
  }
};

// published unPublished coures
export const togglePublishedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", sortByPrice = "" } = req.query;

    // normalize — single value comes as string, multiple as array
    const categories = req.query.categories
      ? [].concat(req.query.categories)
      : [];

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    else if (sortByPrice === "high") sortOptions.coursePrice = -1;

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error in searchCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search courses",
    });
  }
};
