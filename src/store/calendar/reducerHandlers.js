export const setDatesHandler = (state) => {
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
