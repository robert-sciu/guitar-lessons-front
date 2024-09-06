import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});
