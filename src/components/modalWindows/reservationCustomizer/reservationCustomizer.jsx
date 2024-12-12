import { useDispatch, useSelector } from "react-redux";
import {
  selectAvailabilityDates,
  selectAvailabilityHours,
} from "../../../store/fullCalendarSlice";
import CustomDropdown from "../customDropdown/customDropdown";
import {
  addMinutesToIsoString,
  changeISOStringDate,
  changeISOStringHour,
  getDateOnlyFromISOString,
  getLocalHourFromIsoString,
} from "../../../utilities/calendarUtilities";

import styles from "./reservationCustomizer.module.scss";
import Button from "../../elements/button/button";

import config from "../../../../config/config";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

export default function ReservationCustomizer({
  dataHandler,
  onClick,
  reservation,
  showButtons = true,
}) {
  const availableReservationHours = useSelector(selectAvailabilityHours);
  const availableReservationDates = useSelector(selectAvailabilityDates);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  function handleDateChange(newDate) {
    const newStart = changeISOStringDate(reservation.start, newDate);
    const newEnd = changeISOStringDate(reservation.end, newDate);
    dispatch(dataHandler({ ...reservation, start: newStart, end: newEnd }));
  }

  function handleHourChange(newHour) {
    const newStart = changeISOStringHour(reservation.start, newHour);
    const newEnd = addMinutesToIsoString(newStart, reservation.duration);
    dispatch(dataHandler({ ...reservation, start: newStart, end: newEnd }));
  }
  function handleDurationChange(newDuration) {
    const end_UTC = addMinutesToIsoString(reservation.start, newDuration);
    dispatch(
      dataHandler({ ...reservation, end: end_UTC, duration: newDuration })
    );
  }

  return (
    <>
      <div className={styles.dropdownContainer}>
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
      {showButtons && (
        <div className={styles.buttonsContainer}>
          <Button
            label={t("buttons.confirm")}
            onClick={() => onClick(true)}
            style={"greenBtn"}
          />
          <Button label={t("buttons.cancel")} onClick={() => onClick(false)} />
        </div>
      )}
    </>
  );
}

ReservationCustomizer.propTypes = {
  dataHandler: PropTypes.func,
  onClick: PropTypes.func,
  reservation: PropTypes.object,
  showButtons: PropTypes.bool,
};
