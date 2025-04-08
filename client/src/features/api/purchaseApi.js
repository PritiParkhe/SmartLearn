// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const CONST_COURSE_PURCHASE_API = `${
  import.meta.env.VITE_BACKEND_URL
}/purchase`;
export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CONST_COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checout/create-checkout-session",
        method: "POST",
        body: courseId,
      }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = purchaseApi;
