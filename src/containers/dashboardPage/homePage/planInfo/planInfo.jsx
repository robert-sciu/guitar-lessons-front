import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import InfoTile from "../infoTile/infoTile";

import {
  clearPlanInfoError,
  selectPlanInfoDiscount,
  selectPlanInfoErrorMessage,
  selectPlanInfoErrorStatus,
} from "../../../../store/planInfoSlice";

import styles from "./planInfo.module.scss";

import { utcTimeToLocalTimeString } from "../../../../utilities/calendarUtilities";

import PropTypes from "prop-types";

export default function PlanInfo({ planInfo }) {
  //the discount is calculated at planInfoSlice
  const discount = useSelector(selectPlanInfoDiscount);
  const planInfoHasError = useSelector(selectPlanInfoErrorStatus);
  const planInfoError = useSelector(selectPlanInfoErrorMessage);

  const { t } = useTranslation();

  const date = t(`daysOfTheWeek.${planInfo.permanent_reservation_weekday}`);
  const time =
    planInfo.permanent_reservation_start_hour_UTC &&
    utcTimeToLocalTimeString(planInfo.permanent_reservation_start_hour_UTC);
  const hasPermanentReservation = planInfo.has_permanent_reservation;

  return (
    <div className={styles.planInfoContainer}>
      <h4>{t("planInfo.basicInfo")}</h4>
      <div className={styles.detailsContainer}>
        <InfoTile
          label={t("planInfo.hasPermanentReservation")}
          content={
            hasPermanentReservation
              ? t("planInfo.active")
              : t("planInfo.inactive")
          }
          contentClassNames={
            hasPermanentReservation ? ["active"] : ["inactive"]
          }
        />
        <InfoTile
          label={t("planInfo.reschedulesLeftCount")}
          content={planInfo.reschedules_left_count}
        />
        <InfoTile
          label={t("planInfo.cancelledLessonsCount")}
          content={planInfo.cancelled_lesson_count}
        />
        <InfoTile label={t("planInfo.discount")} content={`${discount}%`} />
        {hasPermanentReservation && (
          <>
            <InfoTile
              label={t("planInfo.permanentReservationDate")}
              content={`${date}, ${time}`}
            />
            <InfoTile
              label={t("planInfo.lessonDuration")}
              content={`${planInfo.permanent_reservation_lesson_duration} min`}
            />
          </>
        )}
      </div>
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
