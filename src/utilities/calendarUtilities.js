function createDayHoursObject() {
  const dayStartHour = 8;
  const dayEndHour = 22;
  const dayHours = {};
  for (let i = dayStartHour; i < dayEndHour; i++) {
    dayHours[i] = {
      0: {},
      30: {},
      // isBooked: false,
    };
  }
  return dayHours;
}

function calculateReservationStartAndEnd(reservation) {
  const reservationStart = `${reservation.hour}:${reservation.minute}${
    reservation.minute === 0 ? "0" : ""
  }`;
  const hoursToAdd = Math.floor(reservation.duration / 60);
  const minutesToAdd = reservation.duration % 60;

  const reservationEnd = `${reservation.hour + hoursToAdd}:${
    reservation.minute + minutesToAdd
  }${minutesToAdd === 0 ? "0" : ""}`;
  return { reservationStart, reservationEnd };
}

function attachLessonReservationsToDayHoursObject(
  dayHours,
  lessonReservations
) {
  const dayObjectWithReservations = { ...dayHours };
  lessonReservations.forEach((reservation) => {
    // prettier-ignore
    dayObjectWithReservations[reservation.hour][reservation.minute] = {...reservation, isBooked: true};
    dayObjectWithReservations[reservation.hour]["isBooked"] = true;
    // prettier-ignore
    dayObjectWithReservations[reservation.hour]["bookingMinute"] = reservation.minute;
  });
  // console.log(dayObjectWithReservations);
  return dayObjectWithReservations;
}

function checkIsBooked(hourData) {
  return hourData.isBooked;
}

export {
  createDayHoursObject,
  attachLessonReservationsToDayHoursObject,
  checkIsBooked,
  calculateReservationStartAndEnd,
};
