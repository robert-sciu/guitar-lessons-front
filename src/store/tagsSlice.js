import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAuthenticated,
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.get("/tags");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    refetchNeeded: false,

    fetchComplete: false,
    tags: [],
  },
  reducers: {
    clearTagsError: (state) => {
      state.hasError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, managePendingState)
      .addCase(fetchTags.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.tags = action.payload.map((tag) => ({ ...tag, selected: false }));
        state.fetchComplete = true;
      })
      .addCase(fetchTags.rejected, manageRejectedState);
  },
});

export const { clearTagsError } = tagsSlice.actions;

export const selectTags = (state) => state.tags.tags;
export const selectTagsLoadingStatus = (state) => state.tags.isLoading;
export const selectTagsFetchStatus = (state) => state.tags.fetchComplete;
export const selectTagsErrorStatus = (state) => state.tags.hasError;
export const selectTagsErrorMessage = (state) => state.tags.error;

export default tagsSlice.reducer;
