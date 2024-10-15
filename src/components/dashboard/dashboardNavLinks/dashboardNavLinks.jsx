import { NavLink } from "react-router-dom";
import styles from "./dashboardNavLinks.module.scss";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import {
  HiOutlineHome,
  HiOutlineInboxStack,
  HiMagnifyingGlassPlus,
  HiCheck,
  HiCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlinePower,
} from "react-icons/hi2";

export default function DashboardNavLinks({ onLogout }) {
  const { t } = useTranslation();
  function activeStateStyle({ isActive }) {
    const className = isActive
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;

    return className;
  }
  return (
    <div className={styles.dashboardNavLinksContainer}>
      <ul>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/welcome">
            {t("dashboardNav.home")}
            <div className={styles.icon}>
              <HiOutlineHome />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/tasks">
            {t("dashboardNav.tasks")}
            <div className={styles.icon}>
              <HiOutlineInboxStack />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/availableTasks">
            {t("dashboardNav.availableTasks")}
            <div className={styles.icon}>
              <HiMagnifyingGlassPlus />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/completedTasks">
            {t("dashboardNav.completedTasks")}
            <div className={styles.icon}>
              <HiCheck />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/calendar">
            {t("dashboardNav.calendar")}
            <div className={styles.icon}>
              <HiCalendarDays />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink className={activeStateStyle} to="/dashboard/payments">
            {t("dashboardNav.payments")}
            <div className={styles.icon}>
              <HiOutlineCurrencyDollar />
            </div>
          </NavLink>
        </li>
      </ul>
      <button className={styles.navLink} onClick={onLogout}>
        {t("buttons.logout")}
        <div className={styles.icon}>
          <HiOutlinePower />
        </div>
      </button>
    </div>
  );
}

DashboardNavLinks.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
