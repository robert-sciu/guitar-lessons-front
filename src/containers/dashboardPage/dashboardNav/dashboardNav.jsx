// import { I18nextProvider } from "react-i18next";
// import i18n from "../../../../config/i18n";
import { Outlet, useNavigate } from "react-router-dom";
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
import {
  clearPlanInfoError,
  fetchPlanInfo,
  selectPlanInfoError,
  selectPlanInfoFetchComplete,
  selectPlanInfoHasError,
  selectPlanInfoIsLoading,
} from "../../../store/planInfoSlice";
import DashboardWelcome from "../../../components/dashboard/dashboardWelcome/dashboardWelcome";
import DashboardNavLinks from "../../../components/dashboard/dashboardNavLinks/dashboardNavLinks";
import ErrorWindow from "../../../components/modalWindows/errorWindow/errorWindow";
import {
  clearUserTasksError,
  fetchUserTasks,
  selectUserTasksError,
  selectUserTasksFetchComplete,
  selectUserTasksHasError,
  selectUserTasksIsLoading,
} from "../../../store/userTasksSlice";
import { classNameFormatter } from "../../../utilities/utilities";

export default function DashboardNav() {
  const [loaded, setLoaded] = useState(false);

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

  const userTaskIsLoading = useSelector(selectUserTasksIsLoading);
  const userTaskHasError = useSelector(selectUserTasksHasError);
  const userTaskError = useSelector(selectUserTasksError);
  const userTaskFetchComplete = useSelector(selectUserTasksFetchComplete);

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
  }, [
    isAuthenticated,
    userInfoFetchComplete,
    userInfoIsLoading,
    userInfoHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !planInfoFetchComplete &&
      !planInfoIsLoading &&
      !planInfoHasError
    ) {
      dispatch(fetchPlanInfo());
    }
  }, [
    isAuthenticated,
    planInfoFetchComplete,
    planInfoIsLoading,
    planInfoHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !userTaskFetchComplete &&
      !userTaskIsLoading &&
      !userTaskHasError
    ) {
      dispatch(fetchUserTasks());
    }
  }, [
    isAuthenticated,
    userTaskFetchComplete,
    userTaskIsLoading,
    userTaskHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (!userInfoFetchComplete) return;
    setTimeout(() => {
      setLoaded(true);
    }, 40);
  }, [userInfoFetchComplete]);

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
          classNames: ["dashboardNav", loaded ? "show" : "hide"],
        })}
      >
        {userInfoFetchComplete && (
          <DashboardWelcome username={userInfo.username} />
        )}
        <DashboardNavLinks onLogout={handleLogout} />
      </div>
      <div className={styles.dashboardContent}>
        <Outlet />
        <ErrorWindow
          error={userInfoError}
          showError={userInfoHasError}
          dismissHandler={clearUserInfoError}
        />
        <ErrorWindow
          error={planInfoError}
          showError={planInfoHasError}
          dismissHandler={clearPlanInfoError}
        />
        <ErrorWindow
          error={userTaskError}
          showError={userTaskHasError}
          dismissHandler={clearUserTasksError}
        />
      </div>
    </div>
  );
}
