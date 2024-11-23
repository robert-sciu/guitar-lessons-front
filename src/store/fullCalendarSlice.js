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
  getTodayDate,
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

export const createReservation = createAsyncThunk(
  "fullCalendar/createReservation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/lessonReservations", data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

export const deleteReservation = createAsyncThunk(
  "fullCalendar/deleteReservation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/lessonReservations/${id}`);
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
    tempRescheduleData: {},
    events: [],
    workingHours: getWorkingHoursArray(),
    today: getTodayDate(),

    eventForUpdateId: null,
    moreInfoEvent: {},
    refetchNeeded: false,
  },
  reducers: {
    addTempEvent: (state, action) => {
      state.tempEventData = action.payload;
    },
    clearTempEvents: (state) => {
      state.tempEventData = {};
      state.tempRescheduleData = {};
    },
    updateTempEvent: (state, action) => {
      state.tempEventData = {
        ...state.tempEventData,
        ...action.payload,
      };
    },
    clearCalendarRefetchNeeded: (state) => {
      state.refetchNeeded = false;
    },
    setEventForUpdateId: (state, action) => {
      state.eventForUpdateId = action.payload;
    },
    setTempRescheduleData: (state, action) => {
      state.tempRescheduleData = action.payload;
    },
    setMoreInfoEvent: (state, action) => {
      state.moreInfoEvent = action.payload;
    },
    clearMoreInfoEvent: (state) => {
      state.moreInfoEvent = {};
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
        state.refetchNeeded = true;
        state.eventForUpdateId = null;
        state.tempRescheduleData = {};
      })
      .addCase(updateReservation.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.events = state.events.filter(
          (event) => event.id !== state.eventForUpdateId
        );
        state.eventForUpdateId = null;
        state.refetchNeeded = true;
      })

      .addCase(createReservation.pending, managePendingState)
      .addCase(createReservation.fulfilled, (state) => {
        manageFulfilledState(state);
        state.tempEventData = {};
        state.refetchNeeded = true;
      })
      .addCase(createReservation.rejected, manageRejectedState)

      .addCase(deleteReservation.pending, managePendingState)
      .addCase(deleteReservation.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
        state.moreInfoEvent = {};
      })
      .addCase(deleteReservation.rejected, manageRejectedState);
  },
});

export const {
  addTempEvent,
  clearTempEvents,
  updateTempEvent,
  clearCalendarRefetchNeeded,
  setEventForUpdateId,
  setTempRescheduleData,
  setMoreInfoEvent,
  clearMoreInfoEvent,
} = fullCalendarSlice.actions;

export const selectEvents = (state) => state.fullCalendar.events;
export const selectTempEventData = (state) => state.fullCalendar.tempEventData;
export const selectToday = (state) => state.fullCalendar.today;
export const selectWorkingHoursArray = (state) =>
  state.fullCalendar.workingHours;
export const selectWorkingHoursStart = (state) =>
  getStartHourFromWorkingHoursArray(state.fullCalendar.workingHours);
export const selectWorkingHoursEnd = (state) =>
  getEndHourFromWorkingHoursArray(state.fullCalendar.workingHours);

export const selectReservationsFetchComplete = (state) =>
  state.fullCalendar.fetchComplete;

export const selectCalendarRefetchNeeded = (state) =>
  state.fullCalendar.refetchNeeded;

export const selectTempRescheduleData = (state) =>
  state.fullCalendar.tempRescheduleData;

export const selectMoreInfoEvent = (state) => state.fullCalendar.moreInfoEvent;

export default fullCalendarSlice.reducer;
