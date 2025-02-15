import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import { authApi } from "@/features/api/authapi"

const rootreducer = combineReducers({
  [authApi.reducerPath]:authApi.reducer,
  auth:authReducer
});

export default rootreducer;