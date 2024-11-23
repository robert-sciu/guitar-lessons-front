import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractErrorResponse,
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
      return rejectWithValue(extractErrorResponse(error));
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
      console.log(error);
      return rejectWithValue(extractErrorResponse(error));
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
      return rejectWithValue(extractErrorResponse(error));
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
    moreInfoEvent: {},
    refetchNeeded: false,
    eventsUpdated: false,
    updateFailed: false,
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
    setTempRescheduleData: (state, action) => {
      state.tempRescheduleData = action.payload;
    },
    setMoreInfoEvent: (state, action) => {
      state.moreInfoEvent = action.payload;
    },
    clearMoreInfoEvent: (state) => {
      state.moreInfoEvent = {};
    },
    clearEventsUpdated: (state) => {
      state.eventsUpdated = false;
    },
    setCalendarError: (state, action) => {
      state.hasError = true;
      state.error = action.payload;
    },
    clearCalendarError: (state) => {
      state.hasError = false;
      state.error = null;
      state.updateFailed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, managePendingState)
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.events = action.payload;
        state.fetchComplete = true;
        state.refetchNeeded = false;
        state.tempRescheduleData = {};
        state.tempEventData = {};
        state.moreInfoEvent = {};
        manageFulfilledState(state);
      })
      .addCase(fetchReservations.rejected, manageRejectedState)

      .addCase(updateReservation.pending, managePendingState)
      .addCase(updateReservation.fulfilled, (state) => {
        manageFulfilledState(state);
        state.events = state.events.filter((event) => {
          event.id !== state.tempRescheduleData.id;
        });
        state.refetchNeeded = true;
      })
      .addCase(updateReservation.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.tempRescheduleData = {};
        state.updateFailed = true;
      })

      .addCase(createReservation.pending, managePendingState)
      .addCase(createReservation.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
        state.eventsUpdated = true;
      })
      .addCase(createReservation.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.tempEventData = {};
      })

      .addCase(deleteReservation.pending, managePendingState)
      .addCase(deleteReservation.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.moreInfoEvent = {};
      });
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
  setCalendarError,
  clearCalendarError,
  clearEventsUpdated,
} = fullCalendarSlice.actions;

export const selectCalendarIsLoading = (state) => state.fullCalendar.isLoading;
export const selectCalendarHasError = (state) => state.fullCalendar.hasError;
export const selectCalendarError = (state) => state.fullCalendar.error;

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

export const selectEventsUpdated = (state) => state.fullCalendar.eventsUpdated;

export const selectCalendarUpdateFailed = (state) =>
  state.fullCalendar.updateFailed;

export default fullCalendarSlice.reducer;
