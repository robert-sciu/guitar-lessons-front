import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAuthenticated,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchCompletedUserTasks = createAsyncThunk(
  "userTasks/fetchCompletedTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.get("/userTasks/completed");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

const completedUserTasksSlice = createSlice({
  name: "completedUserTasks",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    refetchNeeded: false,

    fetchComplete: false,
    completedUserTasks: [],
  },
  reducers: {
    clearCompletedUserTasksError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedUserTasks.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchCompletedUserTasks.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.completedUserTasks = action.payload;
        state.fetchComplete = true;
        state.refetchNeeded = false;
      })
      .addCase(fetchCompletedUserTasks.rejected, manageRejectedState);
  },
});

export const { clearCompletedUserTasksError } = completedUserTasksSlice.actions;
export const selectCompletedUserTasks = (state) =>
  state.completedUserTasks.completedUserTasks;
export const selectCompletedUserTasksLoadingStatus = (state) =>
  state.completedUserTasks.isLoading;
export const selectCompletedUserTasksFetchStatus = (state) =>
  state.completedUserTasks.fetchComplete;
export const selectCompletedUserTasksRefetchNeeded = (state) =>
  state.completedUserTasks.refetchNeeded;

export const selectCompletedUserTasksErrorStatus = (state) =>
  state.completedUserTasks.hasError;
export const selectCompletedUserTasksErrorMessage = (state) =>
  state.completedUserTasks.error;

export default completedUserTasksSlice.reducer;
