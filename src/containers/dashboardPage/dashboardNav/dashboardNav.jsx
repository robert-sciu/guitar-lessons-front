import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "../../../../config/i18n";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectIsAuthenticated } from "../../../store/authSlice";
import { useEffect, useState } from "react";
import styles from "./dashboardNav.module.scss";
import {
  clearUserInfoError,
  fetchUserInfo,
  selectUserInfo,
  selectUserInfoError,
  selectUserInfoFetchComplete,
  selectUserInfoHasError,
  selectUserInfoIsLoading,
} from "../../../store/userInfoSlice";
import ErrorWindow from "../calendar/modalWindows/errorWindow/errorWindow";
import DashboardInfo from "../../../components/dashboardInfo/dashboardInfo";
import {
  fetchPlanInfo,
  selectPlanInfoError,
  selectPlanInfoFetchComplete,
  selectPlanInfoHasError,
  selectPlanInfoIsLoading,
} from "../../../store/planInfoSlice";

export default function DashboardNav() {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const userInfo = useSelector(selectUserInfo);
  const userInfoIsLoading = useSelector(selectUserInfoIsLoading);
  const userInfoHasError = useSelector(selectUserInfoHasError);
  const userInfoError = useSelector(selectUserInfoError);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);

  const planInfoIsLoading = useSelector(selectPlanInfoIsLoading);
  const planInfoHasError = useSelector(selectPlanInfoHasError);
  const planInfoError = useSelector(selectPlanInfoError);
  const planInfoFetchComplete = useSelector(selectPlanInfoFetchComplete);

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  });
  useEffect(() => {
    if (
      isAuthenticated &&
      !userInfoFetchComplete &&
      !userInfoIsLoading &&
      !userInfoHasError
    ) {
      dispatch(fetchUserInfo());
    }
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      !planInfoFetchComplete &&
      !planInfoIsLoading &&
      !planInfoHasError
    ) {
      dispatch(fetchPlanInfo());
    }
  });

  useEffect(() => {
    if (userInfoHasError) {
      setError(userInfoError);
    }
  }, [userInfoHasError, userInfoError]);

  useEffect(() => {
    if (planInfoHasError) {
      setError(planInfoError);
    }
  }, [planInfoHasError, planInfoError]);

  function activeStateStyle({ isActive }) {
    const className = isActive
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;

    return className;
  }

  const { t } = useTranslation();
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardNav}>
        <I18nextProvider i18n={i18n}>
          <div className={styles.navList}>
            <div>
              <div className={styles.dashboardInfo}>
                {userInfoFetchComplete && <DashboardInfo userInfo={userInfo} />}
              </div>
              <ul>
                <li>
                  <NavLink className={activeStateStyle} to="/dashboard/welcome">
                    {t("dashboardNav.home")}
                  </NavLink>
                </li>
                <li>
                  <NavLink className={activeStateStyle} to="/dashboard/tasks">
                    {t("dashboardNav.tasks")}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStateStyle}
                    to="/dashboard/availableTasks"
                  >
                    {t("dashboardNav.availableTasks")}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStateStyle}
                    to="/dashboard/completedTasks"
                  >
                    {t("dashboardNav.completedTasks")}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStateStyle}
                    to="/dashboard/calendar"
                  >
                    {t("dashboardNav.calendar")}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStateStyle}
                    to="/dashboard/payments"
                  >
                    {t("dashboardNav.payments")}
                  </NavLink>
                </li>
              </ul>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              {t("dashboardNav.logout")}
            </button>
          </div>
        </I18nextProvider>
      </div>
      <div>
        <Outlet />
        {error && (
          <ErrorWindow error={error} dismissHandler={clearUserInfoError} />
        )}
      </div>
    </div>
  );
}
