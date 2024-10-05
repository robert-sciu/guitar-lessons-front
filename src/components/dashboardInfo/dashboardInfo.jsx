import { useTranslation } from "react-i18next";

import styles from "./dashboardInfo.module.scss";
import PropTypes from "prop-types";

export default function DashboardInfo({ userInfo }) {
  const { t } = useTranslation();
  return (
    <div className={styles.DashboardInfoContainer}>
      <h4>{t("dashboardNav.dashboard")}</h4>
      <p>
        {t("dashboardNav.welcome")} {userInfo.username}
      </p>
      <p>
        {t("dashboardNav.level")}:{userInfo.difficulty_clearance_level}
      </p>
      <p>
        {t("dashboardNav.profileStatus")}:{" "}
        {userInfo.is_confirmed ? (
          <span className={styles.active}>{t("dashboardNav.active")}</span>
        ) : (
          <span className={styles.inactive}>{t("dashboardNav.inactive")}</span>
        )}
      </p>
    </div>
  );
}

DashboardInfo.propTypes = {
  userInfo: PropTypes.object,
};
