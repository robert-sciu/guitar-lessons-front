import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  downloadFile,
  extractResponseData,
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

      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

export const downloadTaskFile = createAsyncThunk(
  "tasks/downloadTaskFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/tasks/download", {
        params: { filename: data.filename },
      });
      const { presignedUrl } = extractResponseData(response);
      const fileResponse = await fetch(presignedUrl);
      if (!fileResponse.ok) {
        throw new Error("Failed to download file");
      }
      const fileBlob = await fileResponse.blob();
      downloadFile(fileBlob, data.filename);
      return true;
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
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
    builder.addCase(fetchAvailableTasks.rejected, (state, action) => {
      manageRejectedState(state, action);
      state.tasks = [];
    });
  },
});

export const selectAvailableTasks = (state) => state.tasks.tasks;
export const selectTasksAssignedToUser = (state, action) => {
  console.log(action);
};
export const selectIsLoadingTasks = (state) => state.tasks.isLoading;
export const selectTasksHasError = (state) => state.tasks.hasError;
export const selectTasksFetchComplete = (state) => state.tasks.fetchComplete;

export default tasksSlice.reducer;
