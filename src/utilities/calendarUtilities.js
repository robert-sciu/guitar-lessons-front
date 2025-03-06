import config from "../../config/config";
import { t } from "i18next";

/**
 * Returns today's date in ISO format (YYYY-MM-DD).
 * @returns {string} Today's date in ISO format (YYYY-MM-DD).
 */
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getReservationEndDate() {
  const todayDate = new Date(getTodayDate());
  return new Date(todayDate.setDate(todayDate.getDate() + 13))
    .toISOString()
    .split("T")[0];
}

function getAvailableDates() {
  const todayDate = new Date(getTodayDate());
  const start = todayDate.setDate(todayDate.getDate() + 1);
  const end = getReservationEndDate();
  const dates = [];
  for (
    let date = new Date(start);
    date <= new Date(end);
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

/**
 * Converts a Date object or string to ISO format (YYYY-MM-DDTHH:MM:SS.mmmZ).
 * @param {Date|string} date The Date object or string to convert.
 * @returns {string} The ISO-formatted date string.
 */
function fullDateToISOString(date) {
  return new Date(date).toISOString();
}

/**
 * Returns the date part of an ISO-formatted date string (YYYY-MM-DDTHH:MM:SS.mmmZ).
 * @param {string} date The ISO-formatted date string to extract the date from.
 * @returns {string} The date part of the ISO-formatted date string.
 */
function getDateOnlyFromISOString(date) {
  return new Date(date).toISOString().split("T")[0];
}

function getLocalDateTimeFromIsoString(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

function getLocalDateFromDateOnly(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Adds the given number of minutes to the given ISO-formatted date string.
 * @param {string} isoString The ISO-formatted date string to add minutes to.
 * @param {number} minutes The number of minutes to add.
 * @returns {number} The timestamp of the resulting date.
 */
function addMinutesToIsoString(isoString, minutes) {
  return new Date(
    new Date(isoString).getTime() + minutes * 60 * 1000
  ).toISOString();
}

function addDaysToIsoString(isoString, days) {
  return new Date(
    new Date(isoString).getTime() + days * 24 * 60 * 60 * 1000
  ).toISOString();
}

function addDaysToLocalDate(date, days) {
  return new Date(new Date(date).getTime() + days * 24 * 60 * 60 * 1000);
}

function getHourFromISOString(isoString) {
  return new Date(isoString).getHours();
}

function getMinutesFromISOString(isoString) {
  return new Date(isoString).getMinutes();
}

function getLocalHourFromIsoString(isoString) {
  const date = new Date(isoString).toTimeString();
  return date.split(":")[0] + ":" + date.split(":")[1];
}

function changeISOStringHour(isoString, newHour) {
  console.log(isoString, newHour);
  const hour = newHour.split(":")[0];
  const minutes = newHour.split(":")[1];
  return new Date(
    new Date(isoString).setHours(hour, minutes, 0, 0)
  ).toISOString();
}

function changeISOStringDate(isoString, newDate) {
  const date = new Date(new Date(isoString));
  date.setFullYear(
    newDate.split("-")[0],
    newDate.split("-")[1] - 1,
    newDate.split("-")[2]
  );
  return date.toISOString();
}

function checkIfReservationDurationIsAllowed(isoStart, isoEnd) {
  return (
    (new Date(isoEnd) - new Date(isoStart)) / (60 * 1000) <= 120 &&
    (new Date(isoEnd) - new Date(isoStart)) / (60 * 1000) >= 60
  );
}

function hourToLocaleStringHour(hour) {
  const date = new Date();
  date.setHours(hour.split(":")[0], hour.split(":")[1], 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric", // Includes minutes, omits seconds
  }).format(date);
}

function checkIfReservationDateIsAllowed(isoStart, isoEnd, todayDate) {
  return (
    getDateOnlyFromISOString(isoStart) > todayDate &&
    getDateOnlyFromISOString(isoEnd) > todayDate
  );
}

function checkIfReservationTimeIsAllowed(isoStart, isoEnd) {
  const openHours = new Date(
    new Date().setUTCHours(config.openHourUTC, 0, 0, 0)
  ).toISOString();

  const closeHours = new Date(
    new Date().setUTCHours(config.closeHourUTC, 0, 0, 0)
  ).toISOString();

  const startHour = getHourFromISOString(isoStart);
  const startMinute = getMinutesFromISOString(isoStart);
  const endHour = getHourFromISOString(isoEnd);
  const endMinute = getMinutesFromISOString(isoEnd);

  const reservationStartHour = new Date(
    new Date().setHours(startHour, startMinute, 0, 0)
  ).toISOString();
  const reservationEndHour = new Date(
    new Date().setHours(endHour, endMinute, 0, 0)
  ).toISOString();

  return (
    reservationStartHour >= openHours &&
    reservationEndHour <= closeHours &&
    reservationStartHour < reservationEndHour
  );
}
function getMinMaxSlots(startTime, endTime) {
  const nightInTheMiddle = startTime > endTime;
  const defaultStart = config.openHourString;
  const defaultEnd = config.closeHourString;
  let start;
  let end;
  if (nightInTheMiddle) {
    if (endTime >= defaultStart) {
      start = defaultStart;
    } else {
      start = startTime;
    }
    if (startTime >= defaultEnd) {
      end = endTime;
    } else {
      end = defaultEnd;
    }
    return { minTime: start, maxTime: end };
  } else {
    if (startTime < defaultStart) {
      start = defaultStart;
    } else {
      start = startTime;
    }
    if (endTime > defaultEnd) {
      end = defaultEnd;
    } else {
      end = endTime;
    }

    return { minTime: start, maxTime: end };
  }
}

function getStartHourFromWorkingHoursArray(array) {
  const startHour = array[0];
  return new Date(new Date().setUTCHours(startHour, 0, 0, 0))
    .toISOString()
    .split("T")[1]
    .split(".")[0];
}

function getEndHourFromWorkingHoursArray(array) {
  const endHour = array[array.length - 1];
  return new Date(new Date().setUTCHours(endHour + 1, 0, 0, 0))
    .toISOString()
    .split("T")[1]
    .split(".")[0];
}

function configWorkingHours() {
  const hourLength = 60 * 60 * 1000;
  const start = new Date().setUTCHours(config.openHourUTC, 0, 0, 0);
  const dayLengthInHours = config.workingDayLengthInHours;

  // we get array of local hours so that we can implement further logic for local availability
  const array = [];
  for (let i = 0; i < dayLengthInHours; i++) {
    array.push(new Date(start + i * hourLength).getHours());
  }

  const calendarStartHour = getStartHourFromWorkingHoursArray(array);
  const calendarEndHour = getEndHourFromWorkingHoursArray(array);

  // we get min and max time slots for the calendar in local time
  const { minTime, maxTime } = getMinMaxSlots(
    calendarStartHour,
    calendarEndHour
  );

  const startHour = new Date(
    new Date().setHours(minTime.split(":")[0], 0, 0)
  ).getHours();
  const endHour = new Date(
    new Date().setHours(maxTime.split(":")[0], 0, 0)
  ).getHours();

  const hoursArray = [];

  for (let i = startHour; i < endHour; i++) {
    hoursArray.push(
      new Date(new Date().setHours(i, 0, 0, 0)).toTimeString().split(":")[0] +
        ":00"
    );
    if (i < endHour - 1) {
      hoursArray.push(
        new Date(new Date().setHours(i, 0, 0, 0)).toTimeString().split(":")[0] +
          ":30"
      );
    }
  }
  return {
    availableHoursArray: hoursArray,
    startHour: minTime,
    endHour: maxTime,
  };
}

/**
 * Configure events for fullCalendar.
 *
 * For each event, if the event belongs to the user (i.e. the event.user_id === userId),
 * then set the event as editable, event start editable, and event duration editable.
 * Also, change the title of the event to "My reservation".
 *
 * @param {array} events - an array of events
 * @param {number} userId - the user id
 * @returns {array} - the configured events
 */
function configureEvents(events, userId) {
  const today = getTodayDate();
  function getColor(event) {
    const startDate = getDateOnlyFromISOString(event.start);
    if (startDate < today) {
      const color = event.user_id === userId ? "#10a71049" : "#a5a5a559";
      return color;
    }
    const color = event.user_id === userId ? "#10a710" : "#a5a5a5";
    return color;
  }

  return events.map((event) => ({
    ...event,
    editable:
      event.user_id === userId && getDateOnlyFromISOString(event.start) > today,
    title: event.user_id === userId ? t("calendar.myReservation") : event.title,
    color: getColor(event),
    duration_min: event.duration,
  }));
}

function configureRescheduleDataFromEvent(event) {
  return {
    event_id: Number(event.id),
    start_UTC: new Date(event.start).toISOString(),
    end_UTC: new Date(event.end).toISOString(),
    duration: (event.end - event.start) / 60000,
  };
}

function objectHasData(obj) {
  return Object.keys(obj).length > 0;
}

function utcTimeToLocalTimeString(utcHour) {
  const date = new Date();
  const hour = utcHour.split(":")[0];
  const minutes = utcHour.split(":")[1];
  date.setUTCHours(hour, minutes, 0, 0);
  const localTime = `${date.getHours()}:${
    date.getMinutes() === 0 ? "00" : date.getMinutes()
  }`;
  return localTime;
}

function localHourToIsoHour(hour) {
  const date = new Date();
  date.setHours(hour.split(":")[0], hour.split(":")[1], 0, 0);
  return new Date(date).toISOString().split("T")[1].split(".")[0];
}

export {
  getTodayDate,
  fullDateToISOString,
  getDateOnlyFromISOString,
  addMinutesToIsoString,
  getHourFromISOString,
  getMinutesFromISOString,
  changeISOStringHour,
  configureEvents,
  checkIfReservationDurationIsAllowed,
  checkIfReservationDateIsAllowed,
  checkIfReservationTimeIsAllowed,
  configureRescheduleDataFromEvent,
  objectHasData,
  utcTimeToLocalTimeString,
  getReservationEndDate,
  configWorkingHours,
  getLocalHourFromIsoString,
  hourToLocaleStringHour,
  getAvailableDates,
  changeISOStringDate,
  getLocalDateTimeFromIsoString,
  getLocalDateFromDateOnly,
  addDaysToIsoString,
  addDaysToLocalDate,
  localHourToIsoHour,
};
