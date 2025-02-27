import { useTranslation } from "react-i18next";

import NavLinkBtn from "../../elements/navLinkBtn/navLinkBtn";

import {
  // HiOutlineHome,
  HiOutlineInboxStack,
  // HiMagnifyingGlassPlus,
  // HiCheck,
  // HiCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlinePower,

  // HiMiniWrenchScrewdriver,
  HiMiniUserGroup,
} from "react-icons/hi2";
import styles from "./adminNavLinks.module.scss";
import PropTypes from "prop-types";

export default function AdminNavLinks({ onLogout }) {
  const { t } = useTranslation();
  return (
    <div className={styles.dashboardNavLinksContainer}>
      <ul className={styles.dashboardNavLinks}>
        <NavLinkBtn
          to="/admin/user_management"
          label={t("adminNav.users")}
          icon={<HiMiniUserGroup />}
        />
        <NavLinkBtn
          to="/admin/task_management"
          label={t("adminNav.tasks")}
          icon={<HiOutlineInboxStack />}
        />
        <NavLinkBtn
          to="/admin/tags"
          label={t("adminNav.tags")}
          icon={<HiOutlineTag />}
        />
        <NavLinkBtn
          to="/dashboard/welcome"
          label={t("adminNav.dashboard")}
          icon={<HiMiniUserGroup />}
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

AdminNavLinks.propTypes = {
  onLogout: PropTypes.func.isRequired,
  showAdminLink: PropTypes.bool,
};
