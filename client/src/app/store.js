import { configureStore } from "@reduxjs/toolkit";
import rootreducer from "./reducer";
import { authApi } from "@/features/api/authapi";

export const appStore = configureStore({
  reducer: rootreducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware),
});
