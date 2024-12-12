import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Button from "../../elements/button/button";

import {
  selectAvailabilityDates,
  selectAvailabilityHours,
  updateTempDataForEventCreation,
} from "../../../store/fullCalendarSlice";
import {
  addMinutesToIsoString,
  changeISOStringDate,
  changeISOStringHour,
  getDateOnlyFromISOString,
  getLocalHourFromIsoString,
} from "../../../utilities/calendarUtilities";

import styles from "./reservationModal.module.scss";

import PropTypes from "prop-types";
import CustomDropdown from "../customDropdown/customDropdown";

import config from "../../../../config/config";
import ReservationCustomizer from "../reservationCustomizer/reservationCustomizer";

export default function ReservationModal({
  reservation,
  onSubmit,
  onCancel,
  dispatch,
}) {
  const { t } = useTranslation();

  // const availableReservationHours = useSelector(selectAvailabilityHours);
  // const availableReservationDates = useSelector(selectAvailabilityDates);

  function handleClick(isConfirmed) {
    if (isConfirmed) {
      const reservationObject = {
        start_UTC: reservation.start,
        end_UTC: reservation.end,
        duration: reservation.duration,
      };

      dispatch(onSubmit(reservationObject));
    } else {
      dispatch(onCancel());
    }
  }

  // function handleDateChange(newDate) {
  //   const newStart = changeISOStringDate(reservation.start, newDate);
  //   const newEnd = changeISOStringDate(reservation.end, newDate);
  //   dispatch(updateTempDataForEventCreation({ start: newStart, end: newEnd }));
  // }

  // function handleHourChange(newHour) {
  //   const newStart = changeISOStringHour(reservation.start, newHour);
  //   const newEnd = addMinutesToIsoString(newStart, reservation.duration);
  //   dispatch(updateTempDataForEventCreation({ start: newStart, end: newEnd }));
  // }
  // function handleDurationChange(newDuration) {
  //   const end_UTC = addMinutesToIsoString(reservation.start, newDuration);
  //   dispatch(
  //     updateTempDataForEventCreation({ end: end_UTC, duration: newDuration })
  //   );
  // }

  return (
    <div className={styles.modalWindow}>
      <p>{t("modals.newReservation")}</p>
      <p>
        {t("modals.date")}: {getDateOnlyFromISOString(reservation.start)}
      </p>
      <ReservationCustomizer
        dataHandler={updateTempDataForEventCreation}
        reservation={reservation}
        onClick={handleClick}
      />

      {/* <div className={styles.dropdownContainer}>
        <p>{t("modals.date")}:</p>

        <CustomDropdown
          availableReservationDates={availableReservationDates}
          selectedValue={getDateOnlyFromISOString(reservation.start)}
          onSelect={handleDateChange}
          type={"date"}
        />
      </div>
      <div className={styles.dropdownContainer}>
        <p>{t("modals.time")}:</p>

        <CustomDropdown
          availableReservationHours={availableReservationHours}
          selectedValue={getLocalHourFromIsoString(reservation.start)}
          onSelect={handleHourChange}
          type={"hour"}
        />
      </div>

      <div className={styles.dropdownContainer}>
        <p>{t("modals.duration")}:</p>

        <CustomDropdown
          availableDurationValues={config.availableReservationLengths}
          selectedValue={reservation.duration}
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
      </div> */}
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
