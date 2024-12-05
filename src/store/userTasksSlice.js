import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAuthenticated,
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchUserTasks = createAsyncThunk(
  "userTasks/fetchUserTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.get("/userTasks");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const addUserTask = createAsyncThunk(
  "userTasks/addUserTask",
  async (data, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.post("/userTasks", data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUserTaskNotes = createAsyncThunk(
  "userTasks/updateUserTaskNotes",
  async (data, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.patch(`/userTasks/userNotes`, data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const deleteUserTask = createAsyncThunk(
  "userTasks/deleteUserTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
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
    hasError: false,
    error: null,
    refetchNeeded: false,

    fetchComplete: false,
    taskToDeleteId: null,
    userTaskUpdated: false,
    userTasks: [],
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
//prettier-ignore
export const selectUserTasksLoadingStatus = (state) => state.userTasks.isLoading;
//prettier-ignore
export const selectUserTasksFetchStatus = (state) => state.userTasks.fetchComplete;
//prettier-ignore
export const selectUserTasksRefetchNeeded = (state) => state.userTasks.refetchNeeded;

export const selectUserTasksErrorStatus = (state) => state.userTasks.hasError;
export const selectUserTasksErrorMessage = (state) => state.userTasks.error;
//prettier-ignore
export const selectUserTaskUpdated = (state) => state.userTasks.userTaskUpdated;
//prettier-ignore
export const selectUserTaskToDeleteId = (state) => state.userTasks.taskToDeleteId;
//prettier-ignore

export default userTasksSlice.reducer;
