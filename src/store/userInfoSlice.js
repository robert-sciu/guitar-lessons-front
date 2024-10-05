import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    fetchComplete: false,
    userInfo: {},
  },
  reducers: {
    clearUserInfoError: (state) => {
      state.hasError = false;
      state.error = null;
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
      .addCase(fetchUserInfo.rejected, manageRejectedState);
  },
});

export const { clearUserInfoError } = userInfoSlice.actions;

export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectUserInfoIsLoading = (state) => state.userInfo.isLoading;
//prettier-ignore
export const selectUserInfoFetchComplete = (state) => state.userInfo.fetchComplete;
export const selectUserInfoHasError = (state) => state.userInfo.hasError;
export const selectUserInfoError = (state) => state.userInfo.error;

export default userInfoSlice.reducer;
