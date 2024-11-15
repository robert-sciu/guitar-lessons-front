import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";
import {
  getEndHourFromWorkingHoursArray,
  getStartHourFromWorkingHoursArray,
  getWorkingHoursArray,
} from "../utilities/calendarUtilities";

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
    tempEventData: {},
    events: [],
    workingHours: getWorkingHoursArray(),
  },
  reducers: {
    addTempEvent: (state, action) => {
      state.tempEventData = action.payload;
    },
    clearTempEvents: (state) => {
      state.tempEventData = {};
    },
    updateTempEvent: (state, action) => {
      state.tempEventData = {
        ...state.tempEventData,
        ...action.payload,
      };
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

export const { addTempEvent, clearTempEvents, updateTempEvent } =
  fullCalendarSlice.actions;

export const selectEvents = (state) => state.fullCalendar.events;
export const selectTempEventData = (state) => state.fullCalendar.tempEventData;
export const selectWorkingHoursArray = (state) =>
  state.fullCalendar.workingHours;
export const selectWorkingHoursStart = (state) =>
  getStartHourFromWorkingHoursArray(state.fullCalendar.workingHours);
export const selectWorkingHoursEnd = (state) =>
  getEndHourFromWorkingHoursArray(state.fullCalendar.workingHours);

export const selectReservationsFetchComplete = (state) =>
  state.fullCalendar.fetchComplete;

export default fullCalendarSlice.reducer;
