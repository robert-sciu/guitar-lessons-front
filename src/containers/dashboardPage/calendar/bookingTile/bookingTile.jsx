import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectRescheduleConfirmationNeeded } from "../../../../store/calendar/calendarSelectors";
import { selectUser } from "../../../../store/authSlice";
import { setEventToDelete } from "../../../../store/calendar/calendarSlice";

export default function BookingTile({ reservation, durationBlocks }) {
  const rescheduleConfirmationNeeded = useSelector(
    selectRescheduleConfirmationNeeded
  );
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const [rescheduling, setRescheduling] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "reservation",
    item: { reservation: reservation },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        setRescheduling(true);
      }
    },
  }));

  useEffect(() => {
    if (rescheduleConfirmationNeeded && rescheduling) {
      setOpacity(0.3);
    } else if (isDragging) {
      setOpacity(0.5);
    } else {
      setOpacity(1);
      setRescheduling(false);
    }
  }, [rescheduleConfirmationNeeded, rescheduling, isDragging]);

  function handleDeleteReservation() {
    dispatch(setEventToDelete({ id: reservation.id, date: reservation.date }));
  }

  function handleOpenDetails() {
    if (user.id !== reservation.user_id) {
      return;
    }
    setDetailsOpen(!detailsOpen);
  }

  const height = durationBlocks * 100;

  return (
    <div
      ref={drag}
      style={{
        backgroundColor: detailsOpen ? "green" : "lightGreen",
        position: "absolute",
        top: 0,
        height: detailsOpen ? `${height + 100}%` : `${height}%`,
        width: detailsOpen ? "200%" : "100%",
        // curson: "pointer",
        opacity,
        zIndex: isDragging ? -100 : 100,
        // zIndex: detailsOpen ? 200 : 100,
      }}
      onClick={handleOpenDetails}
    >
      {reservation.user_id === user.id ? (
        <p>moja lekcja</p>
      ) : (
        <p>{reservation.username}</p>
      )}
      {reservation.user_id === user.id && detailsOpen && (
        <div>
          <p>{reservation.date}</p>
          <p>
            {reservation.hour}:{reservation.minute}
          </p>
          <button onClick={handleDeleteReservation}>delete</button>
        </div>
      )}
    </div>
  );
}

BookingTile.propTypes = {
  reservation: PropTypes.object,
  durationBlocks: PropTypes.number,
};
