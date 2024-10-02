import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";
import { useDispatch } from "react-redux";

export const fetchLessonReservations = createAsyncThunk(
  "calendar/fetchLessonReservations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/lessonReservations");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLessonReservation = createAsyncThunk(
  "calendar/updateLessonReservation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lessonReservations`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoading: false,
    fetchComplete: false,
    datesSet: false,
    hasError: false,
    error: null,
    dates: {},
    rescheduleConfirmationNeeded: false,
    rescheduleConfirmation: false,
  },
  reducers: {
    setDates: (state) => {
      const daysArray = Array.from({ length: 7 }, (_, i) => i);
      const today = new Date();
      const todayWeekday = today.getDay();
      daysArray.map((weekday) => {
        if (weekday === todayWeekday) {
          const date = today.toISOString().split("T")[0];
          state.dates[date] = {
            weekday,
            isCurrentDay: true,
            date,
            lessonReservations: [],
          };
        } else {
          const relativeDate = new Date(today);
          relativeDate.setDate(today.getDate() + (weekday - todayWeekday));
          const date = relativeDate.toISOString().split("T")[0];
          state.dates[date] = {
            weekday,
            isCurrentDay: false,
            date,
            lessonReservations: [],
          };
        }
      });
      state.datesSet = true;
    },
    setRescheduleConfirmationNeeded: (state, action) => {
      state.rescheduleConfirmationNeeded = action.payload;
    },
    setRescheduleConfirmation: (state, action) => {
      state.rescheduleConfirmationNeeded = false;
      state.rescheduleConfirmation = action.payload;
    },
    moveEvent: (state, action) => {
      const { id, previousDate, date, hour, minute } = action.payload;
      const reservationFromState = state.dates[
        previousDate
      ].lessonReservations.find((reservation) => reservation.id === id);
      if (date !== previousDate) {
        reservationFromState["date"] = date;
        state.dates[date].lessonReservations.push(reservationFromState);
        state.dates[previousDate].lessonReservations = state.dates[
          previousDate
        ].lessonReservations.filter((reservation) => reservation.id !== id);
      }
      reservationFromState["hour"] = Number(hour);
      reservationFromState["minute"] = minute;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonReservations.pending, managePendingState)
      .addCase(fetchLessonReservations.fulfilled, (state, action) => {
        manageFulfilledState(state);
        const lessonReservations = action.payload;
        state.fetchComplete = true;
        lessonReservations.forEach((reservation) => {
          if (!state.dates[reservation.date]) return;

          state.dates[reservation.date].lessonReservations.push(reservation);
        });
      })
      .addCase(fetchLessonReservations.rejected, manageRejectedState)

      .addCase(updateLessonReservation.pending, managePendingState)
      .addCase(updateLessonReservation.fulfilled, (state, action) => {
        manageFulfilledState(state);
        calendarSlice.caseReducers.moveEvent(state, action);
      })
      .addCase(updateLessonReservation.rejected, (state, action) => {
        manageRejectedState(state);
        state.error = action.payload;
      });
  },
});

export const { setDates } = calendarSlice.actions;

export const selectDatesAreSet = (state) => state.calendar.datesSet;

export const selectDates = (state) => state.calendar.dates;
export const selectLessonReservations = (state) =>
  state.calendar.lessonReservations;
export const selectFetchReservationsComplete = (state) =>
  state.calendar.fetchComplete;

export const selectRescheduleConfirmationNeeded = (state) =>
  state.calendar.rescheduleConfirmationNeeded;

export const selectRescheduleConfirmation = (state) =>
  state.calendar.rescheduleConfirmation;

export const {
  moveEvent,
  setRescheduleConfirmationNeeded,
  setRescheduleConfirmation,
} = calendarSlice.actions;

export default calendarSlice.reducer;
