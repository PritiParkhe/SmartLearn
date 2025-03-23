import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authapi";

const rootreducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export default rootreducer;
