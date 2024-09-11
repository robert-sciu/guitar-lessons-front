import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/tags");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    isLoading: false,
    fetchComplete: false,
    hasError: false,
    tags: [],
  },
  reducers: {},
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

export const selectTags = (state) => state.tags.tags;
export const selectFetchTagsComplete = (state) => state.tags.fetchComplete;

export const { selectTag } = tagsSlice.actions;

export default tagsSlice.reducer;
