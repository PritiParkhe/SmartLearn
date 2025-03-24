import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = `${import.meta.env.VITE_BACKEND_URL}/course`;
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes:['Refetch_Creator_Course'],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags:['Refetch_Creator_Course']
    }),
    getCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags:['Refetch_Creator_Course']
    }),
  }),
});

export const { useCreateCourseMutation, useGetCourseQuery } = courseApi;
