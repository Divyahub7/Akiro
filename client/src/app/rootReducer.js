import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import userReducer from "../features/user/userSlice.js";
import resumeReducer from "../features/resume/resumeSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  resume: resumeReducer,
});

export default rootReducer;
