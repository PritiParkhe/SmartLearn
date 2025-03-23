import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authapi";
import { courseApi } from "@/features/api/courseApi";

const rootreducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
});

export default rootreducer;
