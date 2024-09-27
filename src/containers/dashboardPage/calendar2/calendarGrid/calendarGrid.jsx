import styles from "./calendarGrid.module.scss";

export default function CalendarGrid() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className={styles.calendarGrid}>
      <div className={styles.gridHeader}>
        {days.map((day, index) => (
          <div key={index} className={styles.gridHeaderDay}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.gridBody}>
        {hours.map((hour, index) => (
          <div key={index} className={styles.gridHour}>
            {hour}
          </div>
        ))}
      </div>
    </div>
  );
}
