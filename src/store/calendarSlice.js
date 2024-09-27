import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import apiClient from "../api/api";

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
      const response = await apiClient.patch(
        `/lessonReservations/${data.id}`,
        data
      );
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
    // lessonReservations: [],
    dates: {},
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
    moveEvent: (state, action) => {
      const {
        reservation: {
          id,
          date: reservationDate,
          hour: reservationHour,
          minute: reservationMinute,
        },
        date,
        hour,
        minute,
      } = action.payload;
      console.log(hour, minute);
      // console.log(date);
      const reservationFromState = state.dates[
        reservationDate
      ].lessonReservations.find((reservation) => reservation.id === id);
      // console.log(
      //   state.dates[date].lessonReservations.forEach((res) => console.log(res))
      // );
      // console.log(reservationFromState);
      if (date !== reservationDate) {
        reservationFromState["date"] = date;
        state.dates[date].lessonReservations.push(reservationFromState);
        state.dates[reservationDate].lessonReservations = state.dates[
          reservationDate
        ].lessonReservations.filter((reservation) => reservation.id !== id);
      }

      reservationFromState["hour"] = Number(hour);
      reservationFromState["minute"] = minute;

      // state.dates[id].top = newTop;
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
      .addCase(fetchLessonReservations.rejected, manageRejectedState);
  },
});

export const { setDates } = calendarSlice.actions;

export const selectDatesAreSet = (state) => state.calendar.datesSet;

export const selectDates = (state) => state.calendar.dates;
export const selectLessonReservations = (state) =>
  state.calendar.lessonReservations;
export const selectFetchReservationsComplete = (state) =>
  state.calendar.fetchComplete;

// export const selectReservationsForDate = (state, date) => {
//   return state.calendar.lessonReservations.filter((reservation) => {
//     return reservation.date === date;
//   });
// };
export const { moveEvent } = calendarSlice.actions;

export default calendarSlice.reducer;
