import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectRescheduleConfirmationNeeded } from "../../../../store/calendar/calendarSelectors";
import { selectUser } from "../../../../store/authSlice";
import { setDetailsModalWindowData } from "../../../../store/calendar/calendarSlice";
import styles from "./bookingTile.module.scss";
import { classNameFormatter } from "../../../../utilities/utilities";
import { useTranslation } from "react-i18next";
// import ReservationDetailsModal from "../reservationDetailsModal/reservationDetailsModal";

export default function BookingTile({ reservation, durationBlocks, weekday }) {
  const rescheduleConfirmationNeeded = useSelector(
    selectRescheduleConfirmationNeeded
  );
  const user = useSelector(selectUser);
  const { t } = useTranslation();

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
      setOpacity(30);
    } else if (isDragging) {
      setOpacity(50);
    } else {
      setOpacity(100);
      setRescheduling(false);
    }
  }, [rescheduleConfirmationNeeded, rescheduling, isDragging]);

  useEffect(() => {
    if (detailsOpen) {
      dispatch(setDetailsModalWindowData({ ...reservation, weekday }));
    }
  }, [detailsOpen, dispatch, reservation, weekday]);

  function handleOpenDetails() {
    if (user.id !== reservation.user_id) {
      return;
    }
    setDetailsOpen(!detailsOpen);
  }

  return (
    <div
      ref={drag}
      className={classNameFormatter({
        styles,
        classNames: [
          "bookingTile",
          `duration${durationBlocks}`,
          `opacity${opacity}`,
        ],
      })}
      onClick={handleOpenDetails}
    >
      {reservation.user_id === user.id ? (
        <p>{t("bookingTile.myReservation")}</p>
      ) : (
        <p>{reservation.username}</p>
      )}
      {/* {reservation.user_id === user.id && detailsOpen && (
        <div>
          <p>{reservation.date}</p>
          <p>
            {reservation.hour}:{reservation.minute}
          </p>
          <button onClick={handleDeleteReservation}>delete</button>
        </div>
      )} */}
    </div>
  );
}

BookingTile.propTypes = {
  reservation: PropTypes.object,
  durationBlocks: PropTypes.number,
  weekday: PropTypes.number,
};
