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

export const updatePlanInfo = createAsyncThunk(
  "adminPlanInfo/updatePlanInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/admin/planInfo/${data.id}`,
        data
      );
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
  reducers: {
    clearAdminPlayInfoError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
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
      .addCase(fetchAllPlanInfo.rejected, manageRejectedState)

      .addCase(updatePlanInfo.pending, managePendingState)
      .addCase(updatePlanInfo.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(updatePlanInfo.rejected, manageRejectedState);
  },
});

export const { clearAdminPlayInfoError } = adminPlanInfoSlice.actions;

export const selectAdminPlanInfo = (state) => state.adminPlanInfo.planInfo;
export const selectAdminPlanInfoLoadingStatus = (state) =>
  state.adminPlanInfo.isLoading;
export const selectAdminPlanInfoErrorStatus = (state) =>
  state.adminPlanInfo.hasError;
export const selectAdminPlanInfoErrorMessage = (state) =>
  state.adminPlanInfo.error;
export const selectAdminPlanInfoFetchStatus = (state) =>
  state.adminPlanInfo.fetchComplete;
export const selectAdminPlanInfoRefetchNeeded = (state) =>
  state.adminPlanInfo.refetchNeeded;

export default adminPlanInfoSlice.reducer;
