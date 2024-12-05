import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./reservationModal.module.scss";
import { useTranslation } from "react-i18next";
import { updateTempDataForEventCreation } from "../../../store/fullCalendarSlice";
import {
  addMinutesToIsoString,
  changeISOStringHour,
  changeISOStringMinutes,
  getDateOnlyFromISOString,
  getHourFromISOString,
  getMinutesFromISOString,
  getWorkingHoursArray,
} from "../../../utilities/calendarUtilities";
import Button from "../../elements/button/button";

export default function ReservationModal({
  reservation,
  onSubmit,
  onCancel,
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

  // const nodeRef = useRef(null);

  function handleClick(isConfirmed) {
    if (isConfirmed) {
      const reservationObject = {
        start_UTC: reservation.start,
        end_UTC: reservation.end,
        duration: selectedDuration,
      };

      dispatch(onSubmit(reservationObject));
    } else {
      dispatch(onCancel());
    }
  }

  function handleDurationChange(e) {
    const newDuration = e.target.value;
    setSelectedDuration(newDuration);
    const end_UTC = addMinutesToIsoString(reservation.start, newDuration);
    dispatch(updateTempDataForEventCreation({ end: end_UTC }));
  }

  function handleHourChange(e) {
    const newHour = e.target.value;
    setReservationStartHour(newHour);
    const newStart = changeISOStringHour(reservation.start, newHour);
    const newEnd = addMinutesToIsoString(newStart, selectedDuration);
    dispatch(updateTempDataForEventCreation({ start: newStart, end: newEnd }));
  }

  function handleMinutesChange(e) {
    const newMinutes = e.target.value;
    setReservationStartMinutes(newMinutes);
    const newStart = changeISOStringMinutes(reservation.start, newMinutes);
    const newEnd = addMinutesToIsoString(newStart, selectedDuration);
    dispatch(updateTempDataForEventCreation({ start: newStart, end: newEnd }));
  }

  return (
    <div className={styles.modalWindow}>
      <p>{t("modals.newReservation")}</p>
      <p>
        {t("modals.date")}: {getDateOnlyFromISOString(reservation.start)}
      </p>
      <p>
        {t("modals.time")}:{" "}
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
        {" : "}
        <select
          id="minute-select"
          name="minute-select"
          value={reservationStartMinutes}
          onChange={handleMinutesChange}
        >
          <option value={0}>00</option>
          <option value={30}>30</option>
        </select>
      </p>
      <div className={styles.timeSelectContainer}>
        <label htmlFor="duration-select">{t("modals.duration")}:</label>
        <select
          id="duration-select"
          name={"duration-select"}
          onChange={handleDurationChange}
          value={selectedDuration}
        >
          <option value={60}>60 {t("modals.minutes")}</option>
          <option value={90}>90 {t("modals.minutes")}</option>
          <option value={120}>120 {t("modals.minutes")}</option>
        </select>
      </div>
      <div className={styles.buttonsContainer}>
        <Button
          label={t("buttons.confirm")}
          onClick={() => handleClick(true)}
        />
        <Button
          label={t("buttons.cancel")}
          onClick={() => handleClick(false)}
        />
      </div>
    </div>
  );
}

ReservationModal.propTypes = {
  reservation: PropTypes.object,
  user: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  dispatch: PropTypes.func,
};
