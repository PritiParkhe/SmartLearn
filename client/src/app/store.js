import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { authApi } from "@/features/api/authapi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
    ),
});

// Load user on app start — checks cookie and hydrates Redux state
const initializeApp = () => {
  appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }),
  );
};

initializeApp();
