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
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/admin/users/${data.id}`);
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
    userInfo: [],
    showMoreId: null,
  },
  reducers: {
    clearError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    clearAdminUserInfoError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    setShowMoreId: (state, action) => {
      state.showMoreId = action.payload;
    },
    clearShowMoreId: (state) => {
      state.showMoreId = null;
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

export const { clearAdminUserInfoError, setShowMoreId, clearShowMoreId } =
  adminUserInfoSlice.actions;

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
export const selectAdminUserShowMoreId = (state) =>
  state.adminUserInfo.showMoreId;

export default adminUserInfoSlice.reducer;
