import { useDrop } from "react-dnd";
import BookingTile from "../bookingTile/bookingTile";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { moveEvent } from "../../../../store/calendarSlice";

export default function CalendarHalfHourBlock({
  date,
  hour,
  minute,
  hourData,
  isBooked,
}) {
  console.log(date);
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "reservation",
    drop: (item, monitor) => {
      dispatch(
        moveEvent({
          reservation: item.reservation,
          date: date,
          hour: hour,
          minute: minute,
        })
      );
      console.log("Dropped item:", item, `${hour}:${minute}`); // Here you can handle the dropped item
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const durationBlocks = isBooked && hourData.duration / 30;

  return (
    <div
      ref={drop}
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        height: "20px",
        backgroundColor: isOver ? "gray" : "lightGray",
      }}
    >
      {isBooked ? (
        <BookingTile reservation={hourData} durationBlocks={durationBlocks} />
      ) : (
        ""
      )}
    </div>
  );
}

CalendarHalfHourBlock.propTypes = {
  hour: PropTypes.string,
  minute: PropTypes.number,
  hourData: PropTypes.object,
  isBooked: PropTypes.bool,
};
