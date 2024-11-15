import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import styles from "./reservationWindow.module.scss";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { updateTempEvent } from "../../../store/fullCalendarSlice";
import {
  addMinutesToIsoString,
  changeISOStringHour,
  changeISOStringMinutes,
  getHourFromISOString,
  getMinutesFromISOString,
  getWorkingHoursArray,
} from "../../../utilities/calendarUtilities";

export default function ReservationWindow({
  reservation,
  confirmHandler,
  dismissHandler,
  dispatch,
}) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [reservationStartHour, setReservationStartHour] = useState(
    getHourFromISOString(reservation.start)
  );
  const [reservationStartMinutes, setReservationStartMinutes] = useState(
    getMinutesFromISOString(reservation.start)
  );

  const nodeRef = useRef(null);

  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(confirmHandler());
    } else {
      dispatch(dismissHandler());
    }
  }

  function handleDurationChange(e) {
    const newDuration = e.target.value;
    setSelectedDuration(newDuration);
    const end_UTC = addMinutesToIsoString(reservation.start, newDuration);
    dispatch(updateTempEvent({ end: end_UTC }));
  }

  function handleHourChange(e) {
    const newHour = e.target.value;
    setReservationStartHour(newHour);
    const newStart = changeISOStringHour(reservation.start, newHour);
    dispatch(updateTempEvent({ start: newStart }));
  }

  function handleMinutesChange(e) {
    const newMinutes = e.target.value;
    setReservationStartMinutes(newMinutes);
    const newStart = changeISOStringMinutes(reservation.start, newMinutes);
    dispatch(updateTempEvent({ start: newStart }));
  }
  console.log(getWorkingHoursArray());

  return (
    <div className={styles.reservationWindowContainer}>
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className={styles.reservationWindow}>
          <p>{t("modals.newReservation")}</p>
          <p>
            {t("modals.date")}: {reservation.start.split("T")[0]}
          </p>
          <p>
            {t("modals.time")}:
            <select
              id="hour-select"
              name="hour-select"
              value={reservationStartHour}
              onChange={handleHourChange}
            >
              {getWorkingHoursArray().map((hour) => {
                return (
                  <option key={hour} value={hour}>
                    {hour < 10 ? `0${hour}` : hour}
                  </option>
                );
              })}
            </select>
            <select
              id="minute-select"
              name="minute-select"
              value={reservationStartMinutes}
              onChange={handleMinutesChange}
            >
              <option value={0}>00</option>
              <option value={30}>30</option>
            </select>
            {}
          </p>
          <div className={styles.timeSelectContainer}>
            <label htmlFor="duration-select">{t("modals.duration")}:</label>
            <select
              id="duration-select"
              name={"duration-select"}
              onChange={handleDurationChange}
              value={selectedDuration}
            >
              <option value={30}>30 {t("modals.minutes")}</option>
              <option value={60}>60 {t("modals.minutes")}</option>
              <option value={90}>90 {t("modals.minutes")}</option>
              <option value={120}>120 {t("modals.minutes")}</option>
            </select>
          </div>
          <div className={styles.buttonsContainer}>
            <button onClick={() => handleClick(true)}>
              {t("buttons.confirm")}
            </button>
            <button onClick={() => handleClick(false)}>
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

ReservationWindow.propTypes = {
  reservation: PropTypes.object,
  user: PropTypes.object,
  confirmHandler: PropTypes.func,
  dismissHandler: PropTypes.func,
  dispatch: PropTypes.func,
};
