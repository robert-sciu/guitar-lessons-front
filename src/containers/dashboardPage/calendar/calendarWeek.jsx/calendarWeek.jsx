import { useSelector } from "react-redux";
import CalendarDay from "../calendarDay/calendarDay";
import {
  selectDates,
  selectDatesAreSet,
} from "../../../../store/calendar/calendarSelectors";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./calendarWeek.module.scss";
import CalendarHoursColumn from "../calendarHoursColumn/calendarHoursColumn";
import { useEffect, useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { classNameFormatter } from "../../../../utilities/utilities";

// import { set } from "lodash";

export default function CalendarWeek() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loadedWeek, setLoadedWeek] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const datesSet = useSelector(selectDatesAreSet);
  const days = Object.values(useSelector(selectDates));

  useEffect(() => {
    if (selectedWeek === loadedWeek) return;
    if (!datesSet) return;
    if (selectedWeek === 1) {
      setWeekData(days.slice(0, 7));
      setLoadedWeek(1);
    } else if (selectedWeek === 2) {
      setWeekData(days.slice(7, 14));
      setLoadedWeek(2);
    }
  }, [selectedWeek, days, datesSet, loadedWeek]);

  function handleChevronClick(direction) {
    if (direction === "left" && loadedWeek !== 1) {
      setSelectedWeek(selectedWeek - 1);
    } else if (direction === "right" && loadedWeek !== 2) {
      setSelectedWeek(selectedWeek + 1);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.calendarWeek}>
        <div
          className={classNameFormatter({
            styles,
            classNames: ["chevron", loadedWeek === 1 && "disabled"],
          })}
          onClick={() => handleChevronClick("left")}
        >
          <IoChevronBack />
        </div>
        <CalendarHoursColumn />
        {weekData.map((day) => (
          <CalendarDay key={day.date} dayData={day} />
        ))}
        <div
          className={classNameFormatter({
            styles,
            classNames: ["chevron", loadedWeek === 2 && "disabled"],
          })}
          onClick={() => handleChevronClick("right")}
        >
          <IoChevronForward />
        </div>
      </div>
    </DndProvider>
  );
}
