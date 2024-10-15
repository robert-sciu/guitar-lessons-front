import { useTranslation } from "react-i18next";
import styles from "./planInfo.module.scss";
import PropTypes from "prop-types";
// import { useDispatch } from "react-redux";

export default function PlanInfo({ planInfo }) {
  const { t } = useTranslation();
  const discount =
    planInfo.regular_discount +
    planInfo.plan_discount +
    planInfo.special_discount;

  const date = t(`daysOfTheWeek.${planInfo.permanent_reservation_weekday}`);
  const time = `${planInfo.permanent_reservation_hour}:${
    planInfo.permanent_reservation_minute === 0
      ? "00"
      : planInfo.permanent_reservation_minute
  }`;

  // const dispatch = useDispatch()

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
              {planInfo.permanent_reservation_lesson_length} min
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
    </div>
  );
}

PlanInfo.propTypes = {
  planInfo: PropTypes.object.isRequired,
};
