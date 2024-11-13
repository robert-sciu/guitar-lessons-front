import { createSlice } from "@reduxjs/toolkit";
import {
  addEventHandler,
  clearCalendarErrorHandler,
  clearNewReservationDataHandler,
  clearUpdateDataHandler,
  deleteEventHandler,
  moveEventHandler,
  setDatesHandler,
  setDetailsModalWindowDataHandler,
  setEventToDeleteHandler,
  setFetchCompleteForNewReservationHandler,
  setFetchCompleteForRescheduleHandler,
  setNewReservationDataHandler,
  setRescheduleConfirmationNeededHandler,
  setUpdateDataHandler,
} from "./reducerHandlers";
import {
  createLessonReservationHandler,
  deleteLessonReservationHandler,
  fetchLessonReservationsHandler,
  updateLessonReservationHandler,
} from "./extraReducerHandlers";

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,

    datesSet: false,
    fetchComplete: false,
    fetchCompleteForReschedule: false,
    fetchCompleteForNewReservation: false,

    dates: {},
    datesAvailableForReschedule: [],
    updateData: {},
    newReservationData: {},
    detailsModalWindowData: {},
    deleteEventData: {},

    showNewReservationModalWindow: false,
    showDetailsModalWindow: false,
    rescheduleConfirmationNeeded: false,
    createReservationConfirmationNeeded: false,
    deleteReservationConfirmationNeeded: false,
  },
  reducers: {
    setDates: setDatesHandler,
    setUpdateData: setUpdateDataHandler,
    setNewReservationData: setNewReservationDataHandler,
    setFetchCompleteForReschedule: setFetchCompleteForRescheduleHandler,
    setRescheduleConfirmationNeeded: setRescheduleConfirmationNeededHandler,
    setEventToDelete: setEventToDeleteHandler,
    setFetchCompleteForNewReservation: setFetchCompleteForNewReservationHandler,
    clearUpdateData: clearUpdateDataHandler,
    clearCalendarError: clearCalendarErrorHandler,
    clearNewReservationData: clearNewReservationDataHandler,
    addEvent: addEventHandler,
    setDetailsModalWindowData: setDetailsModalWindowDataHandler,
    deleteEvent: deleteEventHandler,
    moveEvent: moveEventHandler,
  },
  extraReducers: (builder) => {
    fetchLessonReservationsHandler(builder);
    createLessonReservationHandler(builder);
    updateLessonReservationHandler(builder);
    deleteLessonReservationHandler(builder);
  },
});

export const {
  setDates,
  setUpdateData,
  setNewReservationData,
  setFetchCompleteForReschedule,
  setRescheduleConfirmationNeeded,
  setEventToDelete,
  setFetchCompleteForNewReservation,
  clearUpdateData,
  clearCalendarError,
  clearNewReservationData,
  addEvent,
  setDetailsModalWindowData,
  deleteEvent,
  moveEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
