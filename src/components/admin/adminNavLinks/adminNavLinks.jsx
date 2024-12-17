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
  HiMiniWrenchScrewdriver,
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
          to="/admin/users"
          label={t("adminNav.users")}
          icon={<HiMiniUserGroup />}
        />
        <NavLinkBtn
          to="/dashboard/welcome"
          label={t("adminNav.dashboard")}
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

AdminNavLinks.propTypes = {
  onLogout: PropTypes.func.isRequired,
  showAdminLink: PropTypes.bool,
};
