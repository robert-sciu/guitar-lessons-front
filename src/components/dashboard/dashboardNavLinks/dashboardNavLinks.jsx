import { useTranslation } from "react-i18next";

import NavLinkBtn from "../../elements/navLinkBtn/navLinkBtn";

import {
  HiOutlineHome,
  HiOutlineInboxStack,
  HiMagnifyingGlassPlus,
  HiCheck,
  HiCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlinePower,
} from "react-icons/hi2";
import styles from "./dashboardNavLinks.module.scss";
import PropTypes from "prop-types";

export default function DashboardNavLinks({ onLogout }) {
  const { t } = useTranslation();
  return (
    <div className={styles.dashboardNavLinksContainer}>
      <ul className={styles.dashboardNavLinks}>
        <NavLinkBtn
          to="/dashboard/welcome"
          label={t("dashboardNav.home")}
          icon={<HiOutlineHome />}
        />
        <NavLinkBtn
          to="/dashboard/tasks"
          label={t("dashboardNav.tasks")}
          icon={<HiOutlineInboxStack />}
        />
        <NavLinkBtn
          to="/dashboard/availableTasks"
          label={t("dashboardNav.availableTasks")}
          icon={<HiMagnifyingGlassPlus />}
        />
        <NavLinkBtn
          to="/dashboard/completedTasks"
          label={t("dashboardNav.completedTasks")}
          icon={<HiCheck />}
        />
        <NavLinkBtn
          to="/dashboard/calendar"
          label={t("dashboardNav.calendar")}
          icon={<HiCalendarDays />}
        />
        <NavLinkBtn
          to="/dashboard/payments"
          label={t("dashboardNav.payments")}
          icon={<HiOutlineCurrencyDollar />}
        />
      </ul>
      <NavLinkBtn
        to="/"
        label={t("buttons.logout")}
        icon={<HiOutlinePower />}
        onClick={onLogout}
      />
    </div>
  );
}

DashboardNavLinks.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
