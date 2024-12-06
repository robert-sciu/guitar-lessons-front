import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Button from "../../elements/button/button";

import {
  selectAvailabilityHours,
  updateTempDataForEventCreation,
} from "../../../store/fullCalendarSlice";
import {
  addMinutesToIsoString,
  changeISOStringHour,
  getDateOnlyFromISOString,
  getLocalHourFromIsoString,
} from "../../../utilities/calendarUtilities";

import styles from "./reservationModal.module.scss";

import PropTypes from "prop-types";
import CustomDropdown from "../customDropdown/customDropdown";

import config from "../../../../config/config";

export default function ReservationModal({
  reservation,
  onSubmit,
  onCancel,
  dispatch,
}) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState(
    config.defaultReservationLength
  );
  const [reservationStartHour, setReservationStartHour] = useState(
    getLocalHourFromIsoString(reservation.start)
  );
  const availableReservationHours = useSelector(selectAvailabilityHours);

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

  function handleDurationChange(newDuration) {
    setSelectedDuration(newDuration);
    const end_UTC = addMinutesToIsoString(reservation.start, newDuration);
    dispatch(updateTempDataForEventCreation({ end: end_UTC }));
  }

  function handleHourChange(newHour) {
    setReservationStartHour(newHour);
    const newStart = changeISOStringHour(reservation.start, newHour);
    const newEnd = addMinutesToIsoString(newStart, selectedDuration);
    dispatch(updateTempDataForEventCreation({ start: newStart, end: newEnd }));
  }

  return (
    <div className={styles.modalWindow}>
      <p>{t("modals.newReservation")}</p>
      <p>
        {t("modals.date")}: {getDateOnlyFromISOString(reservation.start)}
      </p>
      <div className={styles.dropdownContainer}>
        <p>{t("modals.time")}:</p>

        <CustomDropdown
          availableReservationHours={availableReservationHours}
          reservationStartHour={reservationStartHour}
          onSelect={handleHourChange}
          type={"hour"}
        />
      </div>

      <div className={styles.dropdownContainer}>
        <p>{t("modals.duration")}:</p>

        <CustomDropdown
          availableDurationValues={config.availableReservationLengths}
          selectedDuration={selectedDuration}
          onSelect={handleDurationChange}
          type={"duration"}
        />
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
