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
import styles from "./calendarDay.module.scss";
import { classNameFormatter } from "../../../../utilities/utilities";

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
    <div className={styles.calendarDay}>
      <div
        className={classNameFormatter({
          styles,
          classNames: ["calendarDayHeader", isCurrentDay && "currentDay"],
        })}
      >
        <p>{t(`daysOfTheWeek.${weekday > 6 ? weekday - 7 : weekday}`)}</p>
        <p>{date}</p>
      </div>
      <div className={styles.calendarHoursContainer}>
        {Object.entries(dayHoursWithReservations).map((hourData) => {
          return (
            <div className={styles.calendarHour} key={hourData[0]}>
              <CalendarHalfHourBlock
                date={date}
                weekday={weekday}
                hour={Number(hourData[0])}
                minute={0}
                hourData={hourData[1][0]}
                isBooked={checkIsBooked(hourData[1][0])}
              />
              <CalendarHalfHourBlock
                date={date}
                weekday={weekday}
                hour={Number(hourData[0])}
                minute={30}
                hourData={hourData[1][30]}
                isBooked={checkIsBooked(hourData[1][30])}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

CalendarDay.propTypes = {
  dayData: PropTypes.object,
  isLabel: PropTypes.bool,
};
