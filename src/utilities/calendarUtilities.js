// function createDayHoursObject() {
//   const dayStartHour = 8;
//   const dayEndHour = 22;
//   const dayHours = {};
//   for (let i = dayStartHour; i < dayEndHour; i++) {
//     dayHours[i] = {
//       0: {},
//       30: {},
//       // isBooked: false,
//     };
//   }
//   return dayHours;
// }

// function calculateReservationStartAndEnd(reservation) {
//   const reservationStart = `${reservation.hour}:${reservation.minute}${
//     reservation.minute === 0 ? "0" : ""
//   }`;
//   const hoursToAdd = Math.floor(reservation.duration / 60);
//   const minutesToAdd = reservation.duration % 60;

//   const reservationEnd = `${reservation.hour + hoursToAdd}:${
//     reservation.minute + minutesToAdd
//   }${minutesToAdd === 0 ? "0" : ""}`;
//   return { reservationStart, reservationEnd };
// }

// function attachLessonReservationsToDayHoursObject(
//   dayHours,
//   lessonReservations
// ) {
//   const dayObjectWithReservations = { ...dayHours };
//   lessonReservations.forEach((reservation) => {
//     // prettier-ignore
//     dayObjectWithReservations[reservation.hour][reservation.minute] = {...reservation, isBooked: true};
//     dayObjectWithReservations[reservation.hour]["isBooked"] = true;
//     // prettier-ignore
//     dayObjectWithReservations[reservation.hour]["bookingMinute"] = reservation.minute;
//   });
//   // console.log(dayObjectWithReservations);
//   return dayObjectWithReservations;
// }

// function checkIsBooked(hourData) {
//   return hourData.isBooked;
// }

// export {
//   createDayHoursObject,
//   attachLessonReservationsToDayHoursObject,
//   checkIsBooked,
//   calculateReservationStartAndEnd,
// };

/**
 * Returns today's date in ISO format (YYYY-MM-DD).
 * @returns {string} Today's date in ISO format (YYYY-MM-DD).
 */
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
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
function dateOnlyFromISOString(date) {
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

function getWorkingHoursArray() {
  const array = [];
  const hourLength = 60 * 60 * 1000;
  const start = new Date().setUTCHours(7, 0, 0, 0);
  const dayLengthInHours = 14;

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

/**
 * Formats business hours into an object or array of objects representing the weekly schedule.
 * If the end time is greater than the start time, returns a single object with business hours.
 * If the start time is greater than the end time, returns an array with two objects,
 * representing hours spanning across midnight.
 *
 * @param {string} startTime - The start time in "HH:MM:SS" format.
 * @param {string} endTime - The end time in "HH:MM:SS" format.
 * @returns {Object|Array} - An object or array of objects representing business hours.
 */
function formatBusinessHours(startTime, endTime) {
  if (endTime > startTime) {
    return {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startTime,
      endTime,
    };
  }

  if (startTime > endTime) {
    return [
      {
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startTime,
        endTime: "24:00:00",
      },
      {
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startTime: "00:00:00",
        endTime,
      },
    ];
  }
}

function getMinMaxSlots(startTime, endTime) {
  const nightInTheMiddle = startTime > endTime;
  console.log("starttime", startTime);
  console.log("endtime", endTime);
  let start;
  let end;
  if (nightInTheMiddle) {
    console.log("nightInTheMiddle");
    if (endTime >= "08:00:00") {
      start = "08:00:00";
    } else {
      start = startTime;
    }
    if (startTime >= "22:00:00") {
      end = endTime;
    } else {
      end = "22:00:00";
    }
    return { minTime: start, maxTime: end };
  } else {
    if (startTime < "08:00:00") {
      start = "08:00:00";
    } else {
      start = startTime;
    }
    if (endTime > "22:00:00") {
      end = "22:00:00";
    } else {
      end = endTime;
    }

    return { minTime: start, maxTime: end };
  }
}

export {
  getTodayDate,
  fullDateToISOString,
  dateOnlyFromISOString,
  addMinutesToIsoString,
  getHourFromISOString,
  getMinutesFromISOString,
  changeISOStringHour,
  changeISOStringMinutes,
  getStartHourFromWorkingHoursArray,
  getEndHourFromWorkingHoursArray,
  getWorkingHoursArray,
  formatBusinessHours,
  getMinMaxSlots,
};
