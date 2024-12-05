import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";

import {
  clearPlanInfoError,
  selectPlanInfoDiscount,
  selectPlanInfoError,
  selectPlanInfoHasError,
} from "../../../../store/planInfoSlice";
// import { useDispatch } from "react-redux";
import styles from "./planInfo.module.scss";

import { utcTimeToLocalTimeString } from "../../../../utilities/calendarUtilities";
import PropTypes from "prop-types";

export default function PlanInfo({ planInfo }) {
  const { t } = useTranslation();
  const discount = useSelector(selectPlanInfoDiscount);

  const date = t(`daysOfTheWeek.${planInfo.permanent_reservation_weekday}`);
  const time = utcTimeToLocalTimeString(
    planInfo.permanent_reservation_start_hour_UTC
  );
  const planInfoHasError = useSelector(selectPlanInfoHasError);
  const planInfoError = useSelector(selectPlanInfoError);

  return (
    <div className={styles.planInfoContainer}>
      <h4>{t("planInfo.basicInfo")}</h4>
      {planInfo.has_permanent_reservation ? (
        <div className={styles.detailsContainer}>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.hasPermanentReservation")}:</p>
            <div className={styles.planInfoDataStatus}>
              <p className={styles.active}>{t("planInfo.active")}</p>
            </div>
          </div>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.reschedulesLeftCount")}:</p>
            <div className={styles.planInfoDataStatus}>
              {planInfo.reschedules_left_count}
            </div>
          </div>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.cancelledLessonsCount")}:</p>
            <div className={styles.planInfoDataStatus}>
              {planInfo.cancelled_lesson_count}
            </div>
          </div>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.discount")}:</p>
            <div className={styles.planInfoDataStatus}>{discount}%</div>
          </div>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.permanentReservationDate")}:</p>
            <div className={styles.planInfoDataStatus}>
              {date}, {time}
            </div>
          </div>

          <div className={styles.planInfoData}>
            <p>{t("planInfo.lessonDuration")}:</p>
            <div className={styles.planInfoDataStatus}>
              {planInfo.permanent_reservation_lesson_duration} min
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.detailsContainer}>
          <div className={styles.planInfoData}>
            <p>{t("planInfo.hasPermanentReservation")}:</p>
            <div className={styles.planInfoDataStatus}>
              <p className={styles.inactive}>{t("planInfo.inactive")}</p>
            </div>
          </div>
        </div>
      )}
      {planInfoHasError && (
        <ModalWindowMain
          modalType="error"
          data={planInfoError}
          onCancel={clearPlanInfoError}
        />
      )}
    </div>
  );
}

PlanInfo.propTypes = {
  planInfo: PropTypes.object.isRequired,
};
