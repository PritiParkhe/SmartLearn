import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = `${import.meta.env.VITE_BACKEND_URL}/progress`;

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  tagTypes: ["CourseProgress"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({ url: `/${courseId}`, method: "GET" }),
      providesTags: ["CourseProgress"],
    }),

    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `${courseId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${courseId}/incomplete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApi;
