import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CalendarGrid from "./calendarGrid/calendarGrid";
import CalendarEvent from "./calendarEvent/calendarEvent";

export default function Calendar() {
  const [events, setEvents] = useState([
    { id: 1, title: "Meeting", top: 100, height: 60 },
  ]);

  const moveEvent = (id, newTop) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, top: newTop } : event))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <CalendarGrid />
        {events.map((event) => (
          <CalendarEvent key={event.id} event={event} moveEvent={moveEvent} />
        ))}
      </div>
    </DndProvider>
  );
}
