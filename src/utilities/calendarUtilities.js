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
  const oneDay = 24 * 60 * 60 * 1000;
  // 13 days is actually 14 days because we count from 0
  return new Date(
    new Date(getTodayDate()).getTime() + oneDay * 13
  ).toISOString();
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

function getHourFromISOString(isoString) {
  return new Date(isoString).getHours();
}

function getMinutesFromISOString(isoString) {
  return new Date(isoString).getMinutes();
}

function changeISOStringHour(isoString, newHour) {
  return new Date(new Date(isoString).setHours(newHour)).toISOString();
}

function changeISOStringMinutes(isoString, newMinutes) {
  return new Date(new Date(isoString).setMinutes(newMinutes)).toISOString();
}

function checkIfReservationDurationIsAllowed(isoStart, isoEnd) {
  return (
    (new Date(isoEnd) - new Date(isoStart)) / (60 * 1000) <= 120 &&
    (new Date(isoEnd) - new Date(isoStart)) / (60 * 1000) >= 60
  );
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

function getWorkingHoursArray() {
  const array = [];
  const hourLength = 60 * 60 * 1000;
  const start = new Date().setUTCHours(config.openHourUTC, 0, 0, 0);
  const dayLengthInHours = config.workingDayLengthInHours;

  for (let i = 0; i < dayLengthInHours; i++) {
    array.push(new Date(start + i * hourLength).getHours());
  }

  return array;
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

export {
  getTodayDate,
  fullDateToISOString,
  getDateOnlyFromISOString,
  addMinutesToIsoString,
  getHourFromISOString,
  getMinutesFromISOString,
  changeISOStringHour,
  changeISOStringMinutes,
  getStartHourFromWorkingHoursArray,
  getEndHourFromWorkingHoursArray,
  getWorkingHoursArray,
  getMinMaxSlots,
  configureEvents,
  checkIfReservationDurationIsAllowed,
  checkIfReservationDateIsAllowed,
  checkIfReservationTimeIsAllowed,
  configureRescheduleDataFromEvent,
  objectHasData,
  utcTimeToLocalTimeString,
  getReservationEndDate,
};
