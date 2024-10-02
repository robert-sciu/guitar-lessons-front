import { useDrop } from "react-dnd";
import BookingTile from "../bookingTile/bookingTile";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRescheduleConfirmation,
  setRescheduleConfirmation,
  setRescheduleConfirmationNeeded,
  updateLessonReservation,
} from "../../../../store/calendarSlice";
import { useEffect, useState } from "react";

export default function CalendarHalfHourBlock({
  id,
  date,
  hour,
  minute,
  hourData,
  isBooked,
}) {
  const [hover, setHover] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("lightGray");
  const [updateData, setUpdateData] = useState({});
  const [dropped, setDropped] = useState(false);

  const rescheduleConfirmed = useSelector(selectRescheduleConfirmation);

  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "reservation",
    drop: (item, monitor) => {
      // if (!rescheduleConfirmed) return;

      setUpdateData({
        oldReservation: item.reservation,
        newDate: date,
        newHour: hour,
        newMinute: minute,
      });

      setDropped(true);
      dispatch(setRescheduleConfirmationNeeded(true));

      // dispatch(
      //   updateLessonReservation({
      //     oldReservation: item.reservation,
      //     newDate: date,
      //     newHour: hour,
      //     newMinute: minute,
      //   })
      // );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (isOver) {
      setBackgroundColor("green");
    } else {
      setBackgroundColor("lightGray");
    }
  }, [isOver]);

  useEffect(() => {
    if (hover) {
      setBackgroundColor("green");
    } else {
      setBackgroundColor("lightGray");
    }
  }, [hover]);

  useEffect(() => {
    if (!isBooked) {
      setBackgroundColor("lightGray");
    }
  }, [isBooked]);

  useEffect(() => {
    if (dropped && rescheduleConfirmed) {
      dispatch(updateLessonReservation(updateData));
      dispatch(setRescheduleConfirmation(false));
      setDropped(false);
      setUpdateData({});
    }
  }, [updateData, rescheduleConfirmed, dropped, dispatch]);

  const durationBlocks = isBooked && hourData.duration / 30;

  return (
    <div
      ref={drop}
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        height: "20px",
        backgroundColor,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
  hour: PropTypes.number,
  minute: PropTypes.number,
  hourData: PropTypes.object,
  isBooked: PropTypes.bool,
  date: PropTypes.string,
};
