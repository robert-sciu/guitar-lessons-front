import { useDrop } from "react-dnd";
import BookingTile from "../bookingTile/bookingTile";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  setNewReservationData,
  setUpdateData,
} from "../../../../store/calendar/calendarSlice";
import { useEffect, useState } from "react";
import { selectUpdateData } from "../../../../store/calendar/calendarSelectors";

export default function CalendarHalfHourBlock({
  date,
  hour,
  minute,
  hourData,
  isBooked,
}) {
  const [hover, setHover] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("lightGray");
  const [reservationToReschedule, setReservationToReschedule] = useState({});
  const [newReservation, setNewReservation] = useState(false);
  const updateData = useSelector(selectUpdateData);

  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "reservation",
    canDrop: (item) => {
      return (
        (item.reservation.date === date &&
          // prettier-ignore
          `${item.reservation.hour}${item.reservation.minute}` !==
            `${hour}${minute}${minute === 0 ? "0" : ""}`) ||
        item.reservation.date !== date
      );
    },
    drop: (item) => {
      dispatch(
        setUpdateData({
          oldReservation: item.reservation,
          newDate: date,
          newHour: hour,
          newMinute: minute,
        })
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (isOver) {
      setBackgroundColor("gray");
    } else {
      setBackgroundColor("lightGray");
    }
  }, [isOver]);

  useEffect(() => {
    if (hover && !isBooked) {
      setBackgroundColor("green");
    } else {
      setBackgroundColor("lightGray");
    }
  }, [hover, isBooked]);

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      if (
        updateData.newDate === date &&
        // prettier-ignore
        `${updateData.newHour}${updateData.newMinute}${updateData.newMinute === 0 ? "0" : ""}` ===
          `${hour}${minute}${minute === 0 ? "0" : ""}`
      ) {
        setReservationToReschedule({
          date: updateData.newDate,
          hour: updateData.newHour,
          minute: updateData.newMinute,
          duration: updateData.oldReservation.duration,
        });
      }
    } else {
      setReservationToReschedule({});
    }
  }, [updateData, date, hour, minute]);

  useEffect(() => {
    if (newReservation) {
      dispatch(setNewReservationData({ date, hour, minute }));
      setNewReservation(false);
    }
  }, [newReservation, date, hour, minute, dispatch]);

  function handleClick(e) {
    if (e.target.draggable || isBooked) return;
    setNewReservation(true);
  }

  const durationBlocks = isBooked && hourData.duration / 30;

  const rescheduleDurationBlocks =
    Object.keys(reservationToReschedule).length > 0 &&
    reservationToReschedule.duration / 30;

  return (
    <div
      ref={drop}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "20px",
        backgroundColor,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(isBooked ? false : true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      {hover && <span style={{ color: "white" }}>+</span>}
      {isBooked ? (
        <BookingTile reservation={hourData} durationBlocks={durationBlocks} />
      ) : (
        ""
      )}
      {Object.keys(reservationToReschedule).length > 0 ? (
        <BookingTile
          reservation={reservationToReschedule}
          durationBlocks={rescheduleDurationBlocks}
        />
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
