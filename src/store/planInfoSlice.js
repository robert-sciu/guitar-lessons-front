import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";

import apiClient from "../api/api";

export const fetchPlanInfo = createAsyncThunk(
  "userInfo/fetchPlanInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/planInfo");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const planInfoSlice = createSlice({
  name: "planInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    fetchComplete: false,
    planInfo: {},
  },
  reducers: {
    clearPlanInfoError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanInfo.pending, managePendingState)
      .addCase(fetchPlanInfo.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.fetchComplete = true;
        state.planInfo = action.payload;
      })
      .addCase(fetchPlanInfo.rejected, manageRejectedState);
  },
});

export const { clearPlanInfoError } = planInfoSlice.actions;

export const selectPlanInfo = (state) => state.planInfo.planInfo;
export const selectPlanInfoIsLoading = (state) => state.planInfo.isLoading;
//prettier-ignore
export const selectPlanInfoFetchComplete = (state) => state.planInfo.fetchComplete;
export const selectPlanInfoHasError = (state) => state.planInfo.hasError;
export const selectPlanInfoError = (state) => state.planInfo.error;

export default planInfoSlice.reducer;
