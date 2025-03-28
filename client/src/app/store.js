import { configureStore } from "@reduxjs/toolkit";
import rootreducer from "./reducer";
import { authApi } from "@/features/api/authapi";
import { courseApi } from "@/features/api/courseApi";

export const appStore = configureStore({
  reducer: rootreducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware, courseApi.middleware),
});
const initializeApp = async () => {
  appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};
initializeApp();
