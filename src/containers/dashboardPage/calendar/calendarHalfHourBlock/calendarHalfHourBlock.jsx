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
import styles from "./calendarHalfHourBlock.module.scss";
import { classNameFormatter } from "../../../../utilities/utilities";

export default function CalendarHalfHourBlock({
  date,
  weekday,
  hour,
  minute,
  hourData,
  isBooked,
}) {
  const [hover, setHover] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("mainWhite");
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
      setBackgroundColor("mainWhite");
    }
  }, [isOver]);

  useEffect(() => {
    if (hover && !isBooked) {
      setBackgroundColor("hoverColor");
    } else {
      setBackgroundColor("mainWhite");
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
      onClick={handleClick}
      className={classNameFormatter({
        styles,
        classNames: ["calendarHalfHourBlock", backgroundColor],
      })}
      onMouseEnter={() => setHover(isBooked ? false : true)}
      onMouseLeave={() => setHover(false)}
    >
      {isBooked && (
        <BookingTile
          reservation={hourData}
          durationBlocks={durationBlocks}
          weekday={weekday}
        />
      )}
      <p className={styles.time}>
        {Intl.DateTimeFormat("pl-PL", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(0, 0, 0, hour, minute))}
      </p>
      {Object.keys(reservationToReschedule).length > 0 && (
        <BookingTile
          reservation={reservationToReschedule}
          durationBlocks={rescheduleDurationBlocks}
        />
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
  weekday: PropTypes.number,
};
