import { useTranslation } from "react-i18next";

import NavLinkBtn from "../../elements/navLinkBtn/navLinkBtn";

import {
  HiOutlineHome,
  HiOutlineInboxStack,
  HiMagnifyingGlassPlus,
  HiCheck,
  HiCalendarDays,
  HiOutlinePower,
  HiMiniWrenchScrewdriver,
  HiMiniUserGroup,
  HiOutlineTag,
  HiOutlineBookOpen,
} from "react-icons/hi2";
import styles from "./dashboardNavLinks.module.scss";
import PropTypes from "prop-types";

export default function DashboardNavLinks({
  onLogout,
  showAdminLink = false,
  showAdminNav = false,
  selectedUser = null,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.dashboardNavLinksContainer}>
      <ul className={styles.dashboardNavLinks}>
        {!showAdminNav && (
          <>
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
              to="/dashboard/notes"
              label={t("dashboardNav.notes")}
              icon={<HiOutlineBookOpen />}
            />
          </>
        )}
        {showAdminNav && (
          <>
            {/* <NavLinkBtn
              to="/admin/welcome"
              label={t("dashboardNav.home")}
              icon={<HiOutlineHome />}
            /> */}
            <NavLinkBtn
              to="/admin/userManagement"
              label={t("adminNav.users")}
              icon={<HiMiniUserGroup />}
            />
            {selectedUser && (
              <div className={styles.selectedUserSubMenu}>
                <p className={styles.selectedUserTile}>
                  User: {selectedUser.username}
                </p>
                <NavLinkBtn
                  to={`/admin/userManagement/tasks`}
                  label={t("adminNav.tasks")}
                  icon={<HiOutlineInboxStack />}
                />
                <NavLinkBtn
                  to={`/admin/userManagement/availableTasks`}
                  label={t("adminNav.availableTasks")}
                  icon={<HiMagnifyingGlassPlus />}
                />
                <NavLinkBtn
                  to={`/admin/userManagement/completedTasks`}
                  label={t("adminNav.completedTasks")}
                  icon={<HiCheck />}
                />
              </div>
            )}
            <NavLinkBtn
              to="/admin/taskManagement"
              label={t("adminNav.tasks")}
              icon={<HiOutlineInboxStack />}
            />
            <NavLinkBtn
              to="/admin/tags"
              label={t("adminNav.tags")}
              icon={<HiOutlineTag />}
            />
            <NavLinkBtn
              to="/admin/calendar"
              label={t("adminNav.calendar")}
              icon={<HiCalendarDays />}
            />
          </>
        )}
        {showAdminLink && (
          <NavLinkBtn
            to={showAdminNav ? "/dashboard/welcome" : "/admin/userManagement"}
            label={t(
              showAdminNav ? "adminNav.dashboard" : "dashboardNav.admin"
            )}
            icon={
              showAdminNav ? <HiMiniUserGroup /> : <HiMiniWrenchScrewdriver />
            }
          />
        )}
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
  showAdminLink: PropTypes.bool,
  showAdminNav: PropTypes.bool,
  selectedUser: PropTypes.object,
};
