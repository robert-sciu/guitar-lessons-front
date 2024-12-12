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
import {
  configureEvents,
  configWorkingHours,
  getAvailableDates,
  getReservationEndDate,
  getTodayDate,
} from "../utilities/calendarUtilities";

export const fetchCalendarEvents = createAsyncThunk(
  "fullCalendar/fetchCalendarEvents",
  async (_, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const userId = getState().userInfo.userInfo.id;
      const response = await apiClient.get("/lessonReservations");
      const extractedData = extractResponseData(response);
      return { response: extractedData, userId };
    } catch (error) {
      return rejectWithValue(extractResponseData(error));
    }
  }
);

export const updateCalendarEvent = createAsyncThunk(
  "fullCalendar/updateCalendarEvent",
  async (data, { getState, rejectWithValue }) => {
    const { event_id, ...updateData } = data;
    try {
      checkAuthenticated(getState);
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

export const createCalendarEvent = createAsyncThunk(
  "fullCalendar/createCalendarEvent",
  async (data, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
      const response = await apiClient.post("/lessonReservations", data);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const deleteCalendarEvent = createAsyncThunk(
  "fullCalendar/deleteCalendarEvent",
  async (id, { getState, rejectWithValue }) => {
    try {
      checkAuthenticated(getState);
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
    refetchNeeded: false,

    fetchComplete: false,

    tempDataForEventCreation: {},
    tempDataForEventReschedule: {},
    tempDataForEventDeletion: {},

    dataForEventMoreInfo: {},
    dataForEventMoreInfoInitial: {},

    calendarEvents: [],
    availabilityHours: configWorkingHours(),
    today: getTodayDate(),
    endDay: getReservationEndDate(),
    availableDates: getAvailableDates(),
  },
  reducers: {
    setTempDataForEventCreation: (state, action) => {
      state.tempDataForEventCreation = action.payload;
    },
    clearTempData: (state) => {
      state.tempDataForEventCreation = {};
      state.tempDataForEventReschedule = {};
      state.dataForEventMoreInfo = {};
      state.tempDataForEventDeletion = {};
    },
    clearTempDataForEventDeletion: (state) => {
      state.tempDataForEventDeletion = {};
    },
    updateTempDataForEventCreation: (state, action) => {
      state.tempDataForEventCreation = action.payload;
    },
    clearFullCalendarRefetchNeeded: (state) => {
      state.refetchNeeded = false;
    },
    setTempDataForEventReschedule: (state, action) => {
      state.tempDataForEventReschedule = action.payload;
    },

    setDataForEventMoreInfo: (state, action) => {
      state.dataForEventMoreInfo = action.payload;
      state.dataForEventMoreInfoInitial = action.payload;
    },
    updateDataForEventMoreInfo: (state, action) => {
      state.dataForEventMoreInfo = action.payload;
    },
    setTempDataForEventDeletion: (state, action) => {
      state.tempDataForEventDeletion = action.payload;
    },
    setFullCalendarError: (state, action) => {
      state.hasError = true;
      state.error = action.payload;
    },
    clearFullCalendarError: (state) => {
      state.hasError = false;
      state.error = null;
      state.tempDataForEventCreation = {};
      state.tempDataForEventReschedule = {};
      state.dataForEventMoreInfo = {};
      state.tempDataForEventDeletion = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, managePendingState)
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.fetchComplete = true;
        state.refetchNeeded = false;
        state.calendarEvents = configureEvents(
          action.payload.response,
          action.payload.userId
        );

        state.tempDataForEventReschedule = {};
        state.tempDataForEventCreation = {};
        state.dataForEventMoreInfo = {};
      })
      .addCase(fetchCalendarEvents.rejected, manageRejectedState)

      .addCase(updateCalendarEvent.pending, managePendingState)
      .addCase(updateCalendarEvent.fulfilled, (state) => {
        manageFulfilledState(state);
        // state.calendarEvents = state.calendarEvents.filter((event) => {
        //   event.id !== state.tempDataForEventReschedule.id;
        // });
        state.refetchNeeded = true;
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.tempDataForEventReschedule = {};
      })

      .addCase(createCalendarEvent.pending, managePendingState)
      .addCase(createCalendarEvent.fulfilled, (state) => {
        manageFulfilledState(state);
        state.refetchNeeded = true;
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.tempDataForEventCreation = {};
      })

      .addCase(deleteCalendarEvent.pending, managePendingState)
      .addCase(deleteCalendarEvent.fulfilled, (state) => {
        manageFulfilledState(state);
        state.dataForEventMoreInfo = {};
        state.dataForEventMoreInfoInitial = {};
        state.tempDataForEventDeletion = {};
        state.refetchNeeded = true;
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.dataForEventMoreInfo = {};
        state.tempDataForEventDeletion = {};
      });
  },
});

export const {
  setTempDataForEventCreation,
  clearTempData,
  updateTempDataForEventCreation,
  setTempDataForEventReschedule,
  setDataForEventMoreInfo,
  setFullCalendarError,
  clearFullCalendarError,
  clearFullCalendarRefetchNeeded,
  updateDataForEventMoreInfo,
  setTempDataForEventDeletion,
  clearTempDataForEventDeletion,
} = fullCalendarSlice.actions;

/////////////////////////////////////////////////////////////////////////////////////
//////////////////////// BASIC CALENDAR SELECTORS ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
export const selectFullCalendarEvents = (state) =>
  state.fullCalendar.calendarEvents;
export const selectFullCalendarLoadingStatus = (state) =>
  state.fullCalendar.isLoading;
export const selectFullCalendarFetchStatus = (state) =>
  state.fullCalendar.fetchComplete;
export const selectFullCalendarRefetchNeeded = (state) =>
  state.fullCalendar.refetchNeeded;

export const selectFullCalendarErrorStatus = (state) =>
  state.fullCalendar.hasError;
export const selectFullCalendarErrorMessage = (state) =>
  state.fullCalendar.error;

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////// EVENT MANAGEMENT SELECTORS //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

export const selectFullCalendarTempDataForCreation = (state) =>
  state.fullCalendar.tempDataForEventCreation;
export const selectFullCalendarTempDataForReschedule = (state) =>
  state.fullCalendar.tempDataForEventReschedule;
export const selectFullCalendarDataForMoreInfo = (state) =>
  state.fullCalendar.dataForEventMoreInfo;
export const selectFullCalendarDataForMoreInfoInitial = (state) =>
  state.fullCalendar.dataForEventMoreInfoInitial;
export const selectFullCalendarEventToDeleteId = (state) =>
  state.fullCalendar.tempDataForEventDeletion;

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////// TIME RELATED SELECTORS //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

export const selectTodayDate = (state) => state.fullCalendar.today;
export const selectEndDay = (state) => state.fullCalendar.endDay;
export const selectAvailabilityHours = (state) =>
  state.fullCalendar.availabilityHours.availableHoursArray;

export const selectAvailabilityStartHour = (state) =>
  state.fullCalendar.availabilityHours.startHour;

export const selectAvailabilityEndHour = (state) =>
  state.fullCalendar.availabilityHours.endHour;

export const selectAvailabilityDates = (state) =>
  state.fullCalendar.availableDates;

export default fullCalendarSlice.reducer;
