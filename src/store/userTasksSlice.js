import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchUserTasks = createAsyncThunk(
  "userTasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/userTasks");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCompletedTasks = createAsyncThunk(
  "userTasks/fetchCompletedTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/userTasks/completed");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addUserTask = createAsyncThunk(
  "userTasks/addUserTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/userTasks", data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUserTaskNotes = createAsyncThunk(
  "userTasks/updateUserTaskNotes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/userTasks/userNotes`, data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const deleteUserTask = createAsyncThunk(
  "userTasks/deleteUserTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/userTasks/${id}`);

      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

const userTasksSlice = createSlice({
  name: "userTasks",
  initialState: {
    isLoading: false,
    fetchComplete: false,
    completedTasksFetchComplete: false,
    hasError: false,
    error: null,
    userTasks: [],
    completedTasks: [],
    userTaskUpdated: false,
    taskToDeleteId: null,
    refetchNeeded: false,
  },
  reducers: {
    clearUserTasksError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    clearUserTaskUpdated: (state) => {
      state.userTaskUpdated = false;
    },
    setTaskToDeleteId: (state, action) => {
      state.taskToDeleteId = action.payload;
    },
    clearTaskToDeleteId: (state) => {
      state.taskToDeleteId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserTask.pending, (state) => {
        managePendingState(state);
      })
      .addCase(addUserTask.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks = action.payload;
        state.userTaskUpdated = true;
      })
      .addCase(addUserTask.rejected, (state, action) => {
        manageRejectedState(state, action);
      })
      .addCase(fetchUserTasks.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks = action.payload;
        state.fetchComplete = true;
        state.refetchNeeded = false;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.userTasks = [];
      })
      .addCase(fetchCompletedTasks.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.completedTasks = action.payload;
        state.completedTasksFetchComplete = true;
      })
      .addCase(fetchCompletedTasks.rejected, manageRejectedState)
      .addCase(deleteUserTask.pending, (state) => {
        managePendingState(state);
      })
      .addCase(deleteUserTask.fulfilled, (state) => {
        manageFulfilledState(state);
        state.taskToDeleteId = null;
        state.userTaskUpdated = true;
        state.refetchNeeded = true;
      })
      .addCase(deleteUserTask.rejected, (state, action) => {
        manageRejectedState(state, action);
      })
      .addCase(updateUserTaskNotes.pending, (state) => {
        managePendingState(state);
      })
      .addCase(updateUserTaskNotes.fulfilled, (state, action) => {
        const userTask = Object.values(state.userTasks).find((userTask) => {
          return userTask.user_task.id === action.payload.user_task_id;
        });
        if (userTask) {
          userTask.user_task.user_notes = action.payload.user_notes;
        }
        manageFulfilledState(state);
      })
      .addCase(updateUserTaskNotes.rejected, (state, action) => {
        manageRejectedState(state, action);
      });
  },
});

export const {
  clearUserTasksError,
  clearUserTaskUpdated,
  setTaskToDeleteId,
  clearTaskToDeleteId,
} = userTasksSlice.actions;

export const selectUserTasks = (state) => state.userTasks.userTasks;
export const selectCompletedTasks = (state) => state.userTasks.completedTasks;
export const selectUserTasksIsLoading = (state) => state.userTasks.isLoading;
export const selectUserTasksHasError = (state) => state.userTasks.hasError;
export const selectUserTasksError = (state) => state.userTasks.error;
export const selectUserTasksFetchComplete = (state) =>
  state.userTasks.fetchComplete;
export const selectCompletedTasksFetchComplete = (state) =>
  state.userTasks.completedTasksFetchComplete;
export const selectUserTaskUpdated = (state) => state.userTasks.userTaskUpdated;
export const selectTaskToDeleteId = (state) => state.userTasks.taskToDeleteId;
export const selectUserTasksRefetchNeeded = (state) =>
  state.userTasks.refetchNeeded;
export default userTasksSlice.reducer;
