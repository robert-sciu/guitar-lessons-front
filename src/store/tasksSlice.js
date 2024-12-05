import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAuthenticated,
  downloadFile,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchAvailableTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.get("/tasks");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

export const downloadTaskFile = createAsyncThunk(
  "tasks/downloadTaskFile",
  async (data, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
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
    hasError: false,
    error: null,
    refetchNeeded: false,

    fetchComplete: false,
    tasksMinimumDifficulty: 0,
    tasks: [],
  },
  reducers: {
    setTasksRefetchNeeded: (state) => {
      state.refetchNeeded = true;
    },
    clearTasksError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    setTasksMinimumDifficultyLevel: (state, action) => {
      state.tasksMinimumDifficulty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAvailableTasks.pending, (state) => {
      managePendingState(state);
    });
    builder.addCase(fetchAvailableTasks.fulfilled, (state, action) => {
      manageFulfilledState(state);
      state.tasks = action.payload;
      state.fetchComplete = true;
      state.refetchNeeded = false;
    });
    builder.addCase(fetchAvailableTasks.rejected, (state, action) => {
      manageRejectedState(state, action);
      state.tasks = [];
    });
  },
});

export const {
  clearTasksError,
  setTasksRefetchNeeded,
  setTasksMinimumDifficultyLevel,
} = tasksSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectTasksLoadingStatus = (state) => state.tasks.isLoading;
export const selectTasksFetchStatus = (state) => state.tasks.fetchComplete;
export const selectTasksRefetchNeeded = (state) => state.tasks.refetchNeeded;

export const selectTasksErrorStatus = (state) => state.tasks.hasError;
export const selectTasksErrorMessage = (state) => state.tasks.error;

export const selectTasksMinimumDifficultyLevel = (state) =>
  state.tasks.tasksMinimumDifficulty;

export default tasksSlice.reducer;
