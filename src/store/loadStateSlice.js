import { createSlice } from "@reduxjs/toolkit";

export const loadStateSlice = createSlice({
  name: "loadState",
  initialState: {
    loadState: {
      dashboardHomePage: false,
      availableTasksPage: false,
      completedUserTasksPage: false,
      userTasksPage: false,
      fullCalendarPage: false,
      registerPage: false,
      loginPage: false,
    },
  },
  reducers: {
    setDashboardHomePageLoaded: (state) => {
      state.loadState.dashboardHomePage = true;
    },
    setAvailableTasksPageLoaded: (state) => {
      state.loadState.availableTasksPage = true;
    },
    setCompletedUserTasksPageLoaded: (state) => {
      state.loadState.completedUserTasksPage = true;
    },
    setUserTasksPageLoaded: (state) => {
      state.loadState.userTasksPage = true;
    },
    setFullCalendarPageLoaded: (state) => {
      state.loadState.fullCalendarPage = true;
    },
    setRegisterPageLoaded: (state) => {
      state.loadState.registerPage = true;
    },
    setLoginPageLoaded: (state) => {
      state.loadState.loginPage = true;
    },
  },
});

export const {
  setDashboardHomePageLoaded,
  setAvailableTasksPageLoaded,
  setCompletedUserTasksPageLoaded,
  setUserTasksPageLoaded,
  setFullCalendarPageLoaded,
  setRegisterPageLoaded,
  setLoginPageLoaded,
} = loadStateSlice.actions;

export const selectDashboardHomePageLoaded = (state) =>
  state.loadState.loadState.dashboardHomePage;

export const selectAvailableTasksPageLoaded = (state) =>
  state.loadState.loadState.availableTasksPage;

export const selectCompletedUserTasksPageLoaded = (state) =>
  state.loadState.loadState.completedUserTasksPage;

export const selectUserTasksPageLoaded = (state) =>
  state.loadState.loadState.userTasksPage;

export const selectFullCalendarPageLoaded = (state) =>
  state.loadState.loadState.fullCalendarPage;

export const selectRegisterPageLoaded = (state) =>
  state.loadState.loadState.registerPage;

export const selectLoginPageLoaded = (state) =>
  state.loadState.loadState.loginPage;

export default loadStateSlice.reducer;
