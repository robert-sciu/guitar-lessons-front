import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../store/authSlice";
import {
  fetchUserInfo,
  selectUserInfo,
  selectUserInfoErrorStatus,
  selectUserInfoFetchStatus,
  selectUserInfoLoadingStatus,
  selectUserRefetchNeeded,
} from "../../../store/userInfoSlice";
import DashboardNavLinks from "../../../components/dashboard/dashboardNavLinks/dashboardNavLinks";
import { classNameFormatter } from "../../../utilities/utilities";
import styles from "./dashboardNav.module.scss";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import useReduxFetch from "../../../hooks/useReduxFetch";
import {
  selectAdminUserSelectedUser,
  selectAdminUserSelectedUserId,
} from "../../../store/admin/adminUserInfoSlice";

export default function DashboardNav({ showAdminNav = false }) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(selectUserInfo);
  const fetchComplete = useSelector(selectUserInfoFetchStatus);
  const selectedUserId = useSelector(
    showAdminNav ? selectAdminUserSelectedUserId : () => null
  );
  const selectedUser = useSelector(
    selectedUserId ? selectAdminUserSelectedUser : () => null
  );

  useReduxFetch({
    fetchAction: fetchUserInfo,
    fetchCompleteSelector: selectUserInfoFetchStatus,
    loadingSelector: selectUserInfoLoadingStatus,
    errorSelector: selectUserInfoErrorStatus,
    refetchSelector: selectUserRefetchNeeded,
  });

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <div className={styles.dashboardContainer}>
      <div
        className={classNameFormatter({
          styles,
          classNames: ["dashboardNav", fetchComplete ? "show" : "hide"],
        })}
      >
        {fetchComplete && (
          <div className={styles.dashboardWelcomeContainer}>
            <div className={styles.dashboardUserIcon}>
              <h3>{userInfo.username[0].toUpperCase()}</h3>
            </div>
            <h4>{t("dashboardNav.dashboard")}</h4>
            <h6>
              {t("dashboardNav.welcome")} {userInfo.username}
            </h6>
          </div>
        )}
        <DashboardNavLinks
          onLogout={handleLogout}
          showAdminLink={userInfo?.role === "admin"}
          showAdminNav={showAdminNav}
          selectedUser={selectedUser}
        />
      </div>
      <div className={styles.dashboardContentContainer}>
        {fetchComplete && <Outlet />}
      </div>
    </div>
  );
}

DashboardNav.propTypes = {
  showAdminNav: PropTypes.bool,
};
