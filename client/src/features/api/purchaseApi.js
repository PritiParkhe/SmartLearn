import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_BACKEND_URL}/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["PurchaseStatus"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["PurchaseStatus"],
    }),

    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: ["PurchaseStatus"],
    }),

    getPurchasedCourses: builder.query({
      query: () => ({ url: "/", method: "GET" }),
    }),

    getMyPurchasedCourses: builder.query({
      query: () => ({ url: "/my-courses", method: "GET" }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
  useGetMyPurchasedCoursesQuery,
} = purchaseApi;
