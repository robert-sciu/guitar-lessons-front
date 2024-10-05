import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../../utilities/reduxUtilities";

import {
  createLessonReservation,
  deleteLessonReservation,
  fetchLessonReservations,
  updateLessonReservation,
} from "./calendarThunks";
import {
  addEventHandler,
  deleteEventHandler,
  moveEventHandler,
} from "./reducerHandlers";

export const fetchLessonReservationsHandler = (builder) => {
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
};

export const updateLessonReservationHandler = (builder) => {
  builder
    .addCase(updateLessonReservation.pending, managePendingState)
    .addCase(updateLessonReservation.fulfilled, (state, action) => {
      manageFulfilledState(state);
      moveEventHandler(state, action);
      state.fetchCompleteForReschedule = true;
      state.rescheduleConfirmationNeeded = false;
      state.updateData = {};
    })
    .addCase(updateLessonReservation.rejected, (state, action) => {
      manageRejectedState(state);
      state.rescheduleConfirmationNeeded = false;
      state.error = action.payload;
    });
};

export const createLessonReservationHandler = (builder) => {
  builder
    .addCase(createLessonReservation.pending, managePendingState)
    .addCase(createLessonReservation.fulfilled, (state, action) => {
      manageFulfilledState(state);

      addEventHandler(state, action);

      state.fetchCompleteForNewReservation = true;
      state.newReservationData = {};
    })
    .addCase(createLessonReservation.rejected, (state, action) => {
      manageRejectedState(state);
      state.newReservationData = {};
      state.error = action.payload;
    });
};

export const deleteLessonReservationHandler = (builder) => {
  builder
    .addCase(deleteLessonReservation.pending, managePendingState)
    .addCase(deleteLessonReservation.fulfilled, (state, action) => {
      manageFulfilledState(state);
      deleteEventHandler(state, action);
      state.deleteEventData = {};
    })
    .addCase(deleteLessonReservation.rejected, (state, action) => {
      manageRejectedState(state);
      state.error = action.payload;
    });
};
