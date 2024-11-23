import { useTranslation } from "react-i18next";
import styles from "./rescheduleModal.module.scss";
import PropTypes from "prop-types";
import {
  getDateOnlyFromISOString,
  getHourFromISOString,
  getMinutesFromISOString,
} from "../../../utilities/calendarUtilities";

export default function RescheduleModal({
  onSubmit,
  reservation,
  onCancel,
  dispatch,
}) {
  const { t } = useTranslation();
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(onSubmit(reservation));
    } else {
      dispatch(onCancel());
    }
  }
  return (
    <div className={styles.modalWindow}>
      <div>
        <p>{t("calendar.acceptReschedule")}</p>
        <div>
          <p>
            {t("calendar.date")}:{" "}
            {getDateOnlyFromISOString(reservation.start_UTC)}
          </p>
        </div>
        <div>
          <p>
            {t("calendar.time")}: {getHourFromISOString(reservation.start_UTC)}:
            {getMinutesFromISOString(reservation.start_UTC) === 0
              ? "00"
              : getMinutesFromISOString(reservation.start_UTC)}
          </p>
        </div>
        <div>
          <p>
            {t("calendar.duration")}: {reservation.duration} min
          </p>
        </div>
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
  );
}

RescheduleModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  reservation: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
};
