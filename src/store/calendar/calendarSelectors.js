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

export const selectFetchCompleteForNewReservation = (state) =>
  state.calendar.fetchCompleteForNewReservation;

export const selectIsLoadingCalendarData = (state) => state.calendar.isLoading;
export const selectFetchCompleteForReschedule = (state) =>
  state.calendar.fetchCompleteForReschedule;

export const selectShowNewReservationModalWindow = (state) =>
  state.calendar.showNewReservationModalWindow;

export const selectUpdateData = (state) => state.calendar.updateData;

export const selectCalendarError = (state) => state.calendar.error;

export const selectHasError = (state) => state.calendar.hasError;

export const selectEventToDelete = (state) => state.calendar.deleteEventData;

export const selectNewReservation = (state) =>
  state.calendar.newReservationData;

export const selectShowDetailsModalWindow = (state) =>
  state.calendar.showDetailsModalWindow;

export const selectDetailsModalWindowData = (state) =>
  state.calendar.detailsModalWindowData;
