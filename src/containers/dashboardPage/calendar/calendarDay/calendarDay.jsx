// import { useSelector } from "react-redux";
// import { selectDates } from "../../../../store/calendarSlice";
// import CalendarHour from "../calendarHour/calendarHour";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  attachLessonReservationsToDayHoursObject,
  checkIsBooked,
  createDayHoursObject,
} from "../../../../utilities/calendarUtilities";
import CalendarHalfHourBlock from "../calendarHalfHourBlock/calendarHalfHourBlock";

export default function CalendarDay({ dayData }) {
  // a slot every half an hour from 8am to 10pm
  const { t } = useTranslation();
  // console.log(dayData);

  const dayHours = createDayHoursObject();

  const { isCurrentDay, date, weekday, lessonReservations } = dayData;

  const dayHoursWithReservations = attachLessonReservationsToDayHoursObject(
    dayHours,
    lessonReservations
  );

  return (
    <div>
      <p
        style={{
          color: isCurrentDay ? "green" : "black",
          fontWeight: isCurrentDay ? "bold" : "normal",
        }}
      >
        {date}
      </p>
      <p
        style={{
          color: isCurrentDay ? "green" : "black",
          fontWeight: isCurrentDay ? "bold" : "normal",
        }}
      >
        {t(`daysOfTheWeek.${weekday}`)}
      </p>
      <div
        style={{
          width: "100px",
        }}
      >
        {Object.entries(dayHoursWithReservations).map(
          (hourData) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid gray",
                }}
                key={hourData[0]}
              >
                <CalendarHalfHourBlock
                  id={`${weekday}${hourData[0]}00`}
                  date={date}
                  hour={Number(hourData[0])}
                  minute={0}
                  hourData={hourData[1][0]}
                  isBooked={checkIsBooked(hourData[1][0])}
                />
                <CalendarHalfHourBlock
                  id={`${weekday}${hourData[0]}30`}
                  date={date}
                  hour={Number(hourData[0])}
                  minute={30}
                  hourData={hourData[1][30]}
                  isBooked={checkIsBooked(hourData[1][30])}
                />
              </div>
            );
          }
          // <CalendarHour
          //   key={hourData[0]}
          //   hourData={hourData}
          //   isBooked={checkIsBooked(hourData)}
          // />
        )}
      </div>
    </div>
  );
}

CalendarDay.propTypes = {
  dayData: PropTypes.object,
  isLabel: PropTypes.bool,
};
