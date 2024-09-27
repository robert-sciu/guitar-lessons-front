import React from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "react-resizable";

export default function CalendarEvent({ event, moveEvent, resizeEvent }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const onResize = (e, { size }) => {
    resizeEvent(event.id, size.height);
  };

  return (
    <Resizable
      height={event.height}
      width={0}
      onResize={onResize}
      minConstraints={[0, 30]}
      maxConstraints={[0, 500]}
    >
      <div
        ref={drag}
        className="calendar-event"
        style={{
          top: event.top,
          height: event.height,
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {event.title}
      </div>
    </Resizable>
  );
}
