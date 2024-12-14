import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";
import userTasksReducer from "./userTasksSlice";
import completedUserTasksReducer from "./completedUserTasksSlice";
import tagsReducer from "./tagsSlice";
import fullCalendarReducer from "./fullCalendarSlice";
// import calendarReducer from "./calendar/calendarSlice";
import userInfoReducer from "./userInfoSlice";
import planInfoReducer from "./planInfoSlice";
import loadStateReducer from "./loadStateSlice";

// export default configureStore({
//   reducer: {
//     auth: authReducer,
//     loadState: loadStateReducer,
//     tasks: tasksReducer,
//     userTasks: userTasksReducer,
//     completedUserTasks: completedUserTasksReducer,
//     tags: tagsReducer,
//     fullCalendar: fullCalendarReducer,
//     // calendar: calendarReducer,
//     userInfo: userInfoReducer,
//     planInfo: planInfoReducer,
//   },
//   devTools: true,
// });

const appReducer = combineReducers({
  auth: authReducer,
  loadState: loadStateReducer,
  tasks: tasksReducer,
  userTasks: userTasksReducer,
  completedUserTasks: completedUserTasksReducer,
  tags: tagsReducer,
  fullCalendar: fullCalendarReducer,
  userInfo: userInfoReducer,
  planInfo: planInfoReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logoutUser/fulfilled") {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer, // Use rootReducer here
  devTools: true,
});
export default store;
