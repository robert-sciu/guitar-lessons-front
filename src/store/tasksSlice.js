import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchAvailableTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/tasks");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    isLoading: false,
    fetchComplete: false,
    hasError: false,
    tasks: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAvailableTasks.pending, (state) => {
      managePendingState(state);
    });
    builder.addCase(fetchAvailableTasks.fulfilled, (state, action) => {
      manageFulfilledState(state);
      state.tasks = action.payload;
      state.fetchComplete = true;
    });
    builder.addCase(fetchAvailableTasks.rejected, (state) => {
      manageRejectedState(state);
      state.tasks = [];
    });
  },
});

export const selectAvailableTasks = (state) => state.tasks.tasks;
export const selectIsLoadingTasks = (state) => state.tasks.isLoading;
export const selectFetchComplete = (state) => state.tasks.fetchComplete;

export default tasksSlice.reducer;
