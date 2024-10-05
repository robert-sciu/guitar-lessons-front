import { useSelector } from "react-redux";
import CalendarDay from "../calendarDay/calendarDay";
import { selectDates } from "../../../../store/calendar/calendarSelectors";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function CalendarWeek() {
  const days = Object.values(useSelector(selectDates));
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {days.map((day) => (
          <CalendarDay key={day.date} dayData={day} />
        ))}
      </div>
    </DndProvider>
  );
}
