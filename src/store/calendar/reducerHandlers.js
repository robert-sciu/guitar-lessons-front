export const setDatesHandler = (state) => {
  const daysArray = Array.from({ length: 14 }, (_, i) => i);
  const today = new Date();
  const todayWeekday = today.getDay();
  const datesAvailableForReschedule = [];

  daysArray.map((weekday) => {
    if (weekday === todayWeekday) {
      const date = today.toISOString().split("T")[0];
      datesAvailableForReschedule.push(date);
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
      if (
        datesAvailableForReschedule.length > 0 &&
        datesAvailableForReschedule.length < 6
      ) {
        datesAvailableForReschedule.push(date);
      }
      state.dates[date] = {
        weekday,
        isCurrentDay: false,
        date,
        lessonReservations: [],
      };
    }
  });
  state.datesSet = true;
  state.datesAvailableForReschedule = datesAvailableForReschedule;
};

export const moveEventHandler = (state, action) => {
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
};
export const addEventHandler = (state, action) => {
  const { id, date, hour, minute, duration, user_id, username } =
    action.payload;
  state.dates[date].lessonReservations.push({
    id,
    date,
    hour,
    minute,
    duration,
    user_id,
    username,
  });
};

export const setDetailsModalWindowDataHandler = (state, action) => {
  state.detailsModalWindowData = action.payload;
  state.showDetailsModalWindow = true;
};

export const deleteEventHandler = (state) => {
  const date = state.deleteEventData.date;
  const id = state.deleteEventData.id;
  state.dates[date].lessonReservations = state.dates[
    date
  ].lessonReservations.filter((reservation) => reservation.id !== id);
};

/////////////////////////////////////////////// Small handlers
//////////////////////////////////////////////////////////////

export const setUpdateDataHandler = (state, action) => {
  state.updateData = action.payload;
  state.rescheduleConfirmationNeeded = true;
};
export const setNewReservationDataHandler = (state, action) => {
  state.newReservationData = action.payload;
  state.showNewReservationModalWindow = true;
};
export const clearUpdateDataHandler = (state) => {
  state.updateData = {};
  state.rescheduleConfirmationNeeded = false;
};
export const clearCalendarErrorHandler = (state) => {
  state.hasError = false;
  state.error = null;
  state.updateData = {};
};
export const clearNewReservationDataHandler = (state) => {
  state.newReservationData = {};
};
export const setRescheduleConfirmationNeededHandler = (state, action) => {
  state.rescheduleConfirmationNeeded = action.payload;
};
export const setFetchCompleteForRescheduleHandler = (state, action) => {
  state.fetchCompleteForReschedule = action.payload;
};
export const setFetchCompleteForNewReservationHandler = (state, action) => {
  state.fetchCompleteForNewReservation = action.payload;
};
export const setEventToDeleteHandler = (state, action) => {
  state.deleteEventData = action.payload;
};
