import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

export const fetchReservations = createAsyncThunk(
  "fullCalendar/fetchReservations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/lessonReservations");
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

export const updateReservation = createAsyncThunk(
  "fullCalendar/updateReservation",
  async (data, { rejectWithValue }) => {
    const { event_id, ...updateData } = data;
    try {
      const response = await apiClient.patch(
        `/lessonReservations/${event_id}`,
        updateData
      );
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

const fullCalendarSlice = createSlice({
  name: "fullCalendar",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    fetchComplete: false,
    events: [],
  },
  reducers: {
    addGhostEvent: (state, action) => {
      console.log(action);
      state.events = [...state.events, action.payload];
    },
    clearGhostEvents: (state) => {
      state.events = state.events.filter((event) => event.id !== "ghost");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, managePendingState)
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.events = action.payload;
        state.fetchComplete = true;
        manageFulfilledState(state);
      })
      .addCase(fetchReservations.rejected, manageRejectedState)

      .addCase(updateReservation.pending, managePendingState)
      .addCase(updateReservation.fulfilled, (state) => {
        manageFulfilledState(state);
      })
      .addCase(updateReservation.rejected, manageRejectedState);
  },
});

export const { addGhostEvent, clearGhostEvents } = fullCalendarSlice.actions;

export const selectEvents = (state) => state.fullCalendar.events;

export const selectReservationsFetchComplete = (state) =>
  state.fullCalendar.fetchComplete;

export default fullCalendarSlice.reducer;
