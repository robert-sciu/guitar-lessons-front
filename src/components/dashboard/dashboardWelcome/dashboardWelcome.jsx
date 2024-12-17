import { useTranslation } from "react-i18next";
import styles from "./dashboardWelcome.module.scss";
import PropTypes from "prop-types";

export default function DashboardWelcome({ username }) {
  const { t } = useTranslation();
  const letter = username[0].toUpperCase();
  return (
    <div className={styles.dashboardWelcomeContainer}>
      <div className={styles.dashboardUserIcon}>
        <h3>{letter}</h3>
      </div>
      <h4>{t("dashboardNav.dashboard")}</h4>
      <h6>
        {t("dashboardNav.welcome")} {username}
      </h6>
    </div>
  );
}

DashboardWelcome.propTypes = {
  username: PropTypes.string,
};
