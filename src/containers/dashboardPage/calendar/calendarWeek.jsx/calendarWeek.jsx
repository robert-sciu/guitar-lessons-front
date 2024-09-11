import CalendarDay from "../calendarDay/calendarDay";

export default function CalendarWeek() {
  const daysArray = Array.from({ length: 7 }, (_, i) => i);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {daysArray.map((day) => (
        <div key={day}>
          <CalendarDay />
        </div>
      ))}
    </div>
  );
}
