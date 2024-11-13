import { useDispatch, useSelector } from "react-redux";
import styles from "./reservationDetailsModal.module.scss";
import { setEventToDelete } from "../../../../store/calendar/calendarSlice";
import PropTypes from "prop-types";
import {
  selectDates,
  selectDetailsModalWindowData,
} from "../../../../store/calendar/calendarSelectors";
import { useTranslation } from "react-i18next";
import { calculateReservationStartAndEnd } from "../../../../utilities/calendarUtilities";
import EditButton from "../../../../components/elements/editButton/editButton";

export default function ReservationDetailsModal() {
  const reservation = useSelector(selectDetailsModalWindowData);
  const availableDates = Object.values(useSelector(selectDates));
  console.log(availableDates);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reservationStart, reservationEnd } =
    calculateReservationStartAndEnd(reservation);

  const [year, month, day] = reservation.date.split("-");
  function handleDeleteReservation() {
    dispatch(setEventToDelete({ id: reservation.id, date: reservation.date }));
  }
  return (
    <div className={styles.reservationDetailsModalBackground}>
      <div className={styles.reservationDetailsModal}>
        <h5>{t("modals.myLesson")}</h5>

        <p>
          {t(`daysOfTheWeek.${reservation.weekday}`)}, {day}{" "}
          {t(`months.${month}`)}, {reservationStart} - {reservationEnd}
        </p>
      </div>
    </div>
  );
}

ReservationDetailsModal.propTypes = {
  reservation: PropTypes.object,
};
