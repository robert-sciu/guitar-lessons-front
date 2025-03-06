// import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import InfoTile from "../infoTile/infoTile";

import // clearPlanInfoError,
// selectPlanInfoDiscount,
// selectPlanInfoErrorMessage,
// selectPlanInfoErrorStatus,
"../../../../store/planInfoSlice";

import styles from "./planInfo.module.scss";

// import { utcTimeToLocalTimeString } from "../../../../utilities/calendarUtilities";

import PropTypes from "prop-types";
import {
  calculatePayment,
  calculateSingleLessonPrice,
} from "../../../../utilities/utilities";
// import { constrainPoint } from "@fullcalendar/core/internal";

export default function PlanInfo({ planInfo, pricingInfo }) {
  const { t } = useTranslation();
  // const { i18n } = useTranslation();
  // const language = ["en", "pl"].includes(i18n.language) ? i18n.language : "en";

  return (
    <div className={styles.planInfoContainer}>
      <h4>{t("planInfo.basicInfo")}</h4>
      <div className={styles.detailsContainer}>
        <InfoTile
          label={t("planInfo.discount")}
          content={`${planInfo.discount}%`}
        />
        <InfoTile
          label={t("planInfo.lessonPrice")}
          content={calculateSingleLessonPrice({ planInfo, pricingInfo })}
        />

        <InfoTile
          label={t("planInfo.Balance")}
          content={
            planInfo &&
            pricingInfo[0] &&
            calculatePayment({ planInfo, pricingInfo })
          }
          contentClassNames={
            planInfo.lesson_balance >= 0 ? ["active"] : ["inactive"]
          }
        />
        <InfoTile
          label={t("planInfo.completedLessonsCount")}
          content={planInfo.lesson_count}
        />
        <InfoTile
          label={t("planInfo.reschedulesCount")}
          content={planInfo.rescheduled_lesson_count}
        />
        <InfoTile
          label={t("planInfo.cancelledLessonsCount")}
          content={planInfo.cancelled_lesson_count}
        />
      </div>
    </div>
  );
}

PlanInfo.propTypes = {
  planInfo: PropTypes.object.isRequired,
  pricingInfo: PropTypes.array.isRequired,
};
