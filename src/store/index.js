import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";
import userTasksReducer from "./userTasksSlice";
import tagsReducer from "./tagsSlice";
import fullCalendarReducer from "./fullCalendarSlice";
// import calendarReducer from "./calendar/calendarSlice";
import userInfoReducer from "./userInfoSlice";
import planInfoReducer from "./planInfoSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    userTasks: userTasksReducer,
    tags: tagsReducer,
    fullCalendar: fullCalendarReducer,
    // calendar: calendarReducer,
    userInfo: userInfoReducer,
    planInfo: planInfoReducer,
  },
  devTools: true,
});
