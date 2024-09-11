import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
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
      return response.data.data.Tasks;
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserTaskNotes = createAsyncThunk(
  "userTasks/updateUserTaskNotes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/userTasks/userNotes`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUserTask = createAsyncThunk(
  "userTasks/deleteUserTask",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/userTasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userTasksSlice = createSlice({
  name: "userTasks",
  initialState: {
    isLoading: false,
    fetchComplete: false,
    hasError: false,
    userTasks: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUserTask.pending, (state) => {
        managePendingState(state);
      })
      .addCase(addUserTask.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks.push(action.payload);
      })
      .addCase(addUserTask.rejected, (state) => {
        manageRejectedState(state);
      })
      .addCase(fetchUserTasks.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks = action.payload;
        state.fetchComplete = true;
      })
      .addCase(fetchUserTasks.rejected, (state) => {
        manageRejectedState(state);
        state.userTasks = [];
      })
      .addCase(deleteUserTask.pending, (state) => {
        managePendingState(state);
      })
      .addCase(deleteUserTask.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks = Object.values(state.userTasks).filter(
          (task) => task.UserTask.id !== action.payload
        );
      })
      .addCase(deleteUserTask.rejected, (state) => {
        manageRejectedState(state);
      })
      .addCase(updateUserTaskNotes.pending, (state) => {
        managePendingState(state);
      })
      .addCase(updateUserTaskNotes.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userTasks = Object.values(state.userTasks).map((task) => {
          if (task.UserTask.id === action.payload.id) {
            return { ...task, UserTask: action.payload };
          }
          return task;
        });
      })
      .addCase(updateUserTaskNotes.rejected, (state) => {
        manageRejectedState(state);
      });
  },
});

export const selectUserTasks = (state) => state.userTasks.userTasks;
export const selectIsLoadingUserTasks = (state) => state.userTasks.isLoading;
export const selectHasErrorUserTasks = (state) => state.userTasks.hasError;
export const selectFetchComplete = (state) => state.userTasks.fetchComplete;
export default userTasksSlice.reducer;
