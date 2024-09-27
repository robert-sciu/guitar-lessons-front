import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";
import userTasksReducer from "./userTasksSlice";
import tagsReducer from "./tagsSlice";
import calendarReducer from "./calendarSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    userTasks: userTasksReducer,
    tags: tagsReducer,
    calendar: calendarReducer,
  },
  devTools: true,
});
