import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";

import apiClient from "../api/api";

export const fetchUserInfo = createAsyncThunk(
  "userInfo/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "userInfo/updateUser",
  async (data, { rejectWithValue }) => {
    const { id, ...updateData } = data;
    try {
      await apiClient.patch(`/users/${id}`, updateData);
      return true;
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUserMailCodeRequest = createAsyncThunk(
  "userInfo/updateUserEmallCodeRequest",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/users/change_email_address",
        email
      );
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateEmail = createAsyncThunk(
  "userInfo/updateEmail",
  async (changeEmailToken, { rejectWithValue }) => {
    try {
      await apiClient.patch("/users/change_email_address", changeEmailToken);
      return true;
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    fetchComplete: false,

    emailChangeConfirmationCodeRequired: false,
    emailChangeResponse: "",
    userInfo: {},

    refetchNeeded: false,
  },
  reducers: {
    clearUserInfoError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    cancelEmailChange: (state) => {
      state.emailChangeConfirmationCodeRequired = false;
      state.emailChangeResponse = "";
    },
    clearRefetchNeeded: (state) => {
      state.refetchNeeded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, managePendingState)
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.fetchComplete = true;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, manageRejectedState)

      .addCase(updateUser.pending, managePendingState)
      .addCase(updateUser.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(updateUser.rejected, manageRejectedState)

      .addCase(updateUserMailCodeRequest.pending, managePendingState)
      .addCase(updateUserMailCodeRequest.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.emailChangeConfirmationCodeRequired = true;
        state.emailChangeResponse = action.payload;
      })
      .addCase(updateUserMailCodeRequest.rejected, manageRejectedState)

      .addCase(updateEmail.pending, managePendingState)
      .addCase(updateEmail.fulfilled, (state) => {
        manageFulfilledState(state);
        state.emailChangeConfirmationCodeRequired = false;
        state.refetchNeeded = true;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.emailChangeConfirmationCodeRequired = false;
      });
  },
});

export const { clearUserInfoError, cancelEmailChange, clearRefetchNeeded } =
  userInfoSlice.actions;

export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectUserId = (state) => state.userInfo.userInfo.id;
export const selectUserMinimumTaskLevel = (state) =>
  state.userInfo.userInfo.minimum_task_level_to_display;
export const selectUserInfoIsLoading = (state) => state.userInfo.isLoading;
//prettier-ignore
export const selectUserInfoFetchComplete = (state) => state.userInfo.fetchComplete;
export const selectUserInfoHasError = (state) => state.userInfo.hasError;
export const selectUserInfoError = (state) => state.userInfo.error;
export const selectUserRefetchNeeded = (state) => state.userInfo.refetchNeeded;

export const selectEmailChangeResponse = (state) =>
  state.userInfo.emailChangeResponse;

export const selectEmailChangeConfirmationCodeRequired = (state) =>
  state.userInfo.emailChangeConfirmationCodeRequired;

export default userInfoSlice.reducer;
