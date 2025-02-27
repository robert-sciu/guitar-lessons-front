import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/api";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../../utilities/reduxUtilities";

export const fetchAllPlanInfo = createAsyncThunk(
  "adminPlanInfo/fetchAllPlanInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/planInfo");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

const adminPlanInfoSlice = createSlice({
  name: "adminPlanInfo",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    refetchNeeded: false,
    fetchComplete: false,
    planInfo: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlanInfo.pending, managePendingState)
      .addCase(fetchAllPlanInfo.fulfilled, (state, action) => {
        manageFulfilledState(state);
        // state.planInfo = action.payload;
        action.payload.forEach((plan) => {
          state.planInfo[plan.user_id] = plan;
        });
        state.fetchComplete = true;
        state.refetchNeeded = false;
      })
      .addCase(fetchAllPlanInfo.rejected, manageRejectedState);
  },
});

export const selectAdminPlanInfo = (state) => state.adminPlanInfo.planInfo;

export default adminPlanInfoSlice.reducer;
