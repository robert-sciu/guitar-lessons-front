import CalendarHour from "../calendarHour/calendarHour";

export default function CalendarDay() {
  // a slot every half an hour from 8am to 10pm
  const availableHourSlotsCount = 28;
  const hoursArray = Array.from(
    { length: availableHourSlotsCount },
    (_, i) => i
  );
  return (
    <div>
      {hoursArray.map((hour) => (
        <div key={hour}>
          <CalendarHour />
        </div>
      ))}
    </div>
  );
}
