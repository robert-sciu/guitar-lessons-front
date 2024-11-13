import { createDayHoursObject } from "../../../../utilities/calendarUtilities";
import styles from "./calendarHoursColumn.module.scss";

export default function CalendarHoursColumn() {
  const dayHours = createDayHoursObject();
  return (
    <div className={styles.calendarHoursColumn}>
      <div className={styles.calendarHoursColumnHeader}>hours</div>
      {dayHours &&
        Object.entries(dayHours).map((hourData) => {
          return (
            <div className={styles.calendarHour} key={hourData[0]}>
              <p>{hourData[0]}:00</p>
            </div>
          );
        })}
    </div>
  );
}
