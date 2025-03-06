import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/api";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";

export const fetchPricingInfo = createAsyncThunk(
  "pricing/fetchPricing",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("open/pricing");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

const pricingInfoSlice = createSlice({
  name: "pricingInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    fetchComplete: false,
    pricingData: [],
  },
  reducers: {
    clearPricingInfoError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingInfo.pending, (state) => {
        managePendingState(state);
      })
      .addCase(fetchPricingInfo.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.fetchComplete = true;
        state.pricingData = action.payload;
      })
      .addCase(fetchPricingInfo.rejected, (state, action) => {
        manageRejectedState(state, action);
      });
  },
});

export const { clearPricingInfoError } = pricingInfoSlice.actions;

export const selectPricingInfo = (state) => state.pricingInfo.pricingData;
export const selectPricingInfoLoadingStatus = (state) =>
  state.pricingInfo.isLoading;
export const selectPricingInfoFetchStatus = (state) =>
  state.pricingInfo.fetchComplete;
export const selectPricingInfoErrorStatus = (state) =>
  state.pricingInfo.hasError;
export const selectPricingInfoErrorMessage = (state) => state.pricingInfo.error;

export default pricingInfoSlice.reducer;
