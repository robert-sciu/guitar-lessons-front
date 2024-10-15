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

export const updateUserUsername = createAsyncThunk(
  "userInfo/updateUserUsername",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users", data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateUserMailCodeRequest = createAsyncThunk(
  "userInfo/updateUserEmallCodeRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/users/change_email_address",
        data
      );
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const updateEmail = createAsyncThunk(
  "userInfo/updateEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        "/users/change_email_address",
        data
      );
      return extractResponseData(response);
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

      .addCase(updateUserUsername.pending, managePendingState)
      .addCase(updateUserUsername.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.userInfo = action.payload;
      })
      .addCase(updateUserUsername.rejected, manageRejectedState)

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
      })
      .addCase(updateEmail.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.emailChangeConfirmationCodeRequired = false;
      });
  },
});

export const { clearUserInfoError, cancelEmailChange } = userInfoSlice.actions;

export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectUserInfoIsLoading = (state) => state.userInfo.isLoading;
//prettier-ignore
export const selectUserInfoFetchComplete = (state) => state.userInfo.fetchComplete;
export const selectUserInfoHasError = (state) => state.userInfo.hasError;
export const selectUserInfoError = (state) => state.userInfo.error;

export const selectEmailChangeResponse = (state) =>
  state.userInfo.emailChangeResponse;

export const selectEmailChangeConfirmationCodeRequired = (state) =>
  state.userInfo.emailChangeConfirmationCodeRequired;

export default userInfoSlice.reducer;
