import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../../utilities/reduxUtilities";
import apiClient from "../../api/api";

export const fetchAllUsers = createAsyncThunk(
  "adminUserInfo/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/users");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminUserInfo/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/admin/users/${data.id}`, data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminUserInfo/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

const adminUserInfoSlice = createSlice({
  name: "adminUserInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    refetchNeeded: false,
    fetchComplete: false,
    userInfo: {},
  },
  reducers: {
    clearError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userInfo = action.payload.sort((a, b) => a.id - b.id);
        state.fetchComplete = true;
        state.refetchNeeded = false;
      })
      .addCase(fetchAllUsers.rejected, manageRejectedState)

      .addCase(updateUser.pending, managePendingState)
      .addCase(updateUser.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(updateUser.rejected, manageRejectedState)

      .addCase(deleteUser.pending, managePendingState)
      .addCase(deleteUser.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(deleteUser.rejected, manageRejectedState);
  },
});

export const { clearAdminUserInfoError } = adminUserInfoSlice.actions;

export const selectAdminUserInfo = (state) => state.adminUserInfo.userInfo;
export const selectAdminUserInfoLoadingStatus = (state) =>
  state.adminUserInfo.isLoading;
export const selectAdminUserInfoErrorStatus = (state) =>
  state.adminUserInfo.hasError;
export const selectAdminUserInfoErrorMessage = (state) =>
  state.adminUserInfo.error;
export const selectAdminUserInfoFetchStatus = (state) =>
  state.adminUserInfo.fetchComplete;
export const selectAdminUserInfoRefetchNeeded = (state) =>
  state.adminUserInfo.refetchNeeded;

export default adminUserInfoSlice.reducer;
