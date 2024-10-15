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
  fetchPlanInfo,
  selectPlanInfoError,
  selectPlanInfoFetchComplete,
  selectPlanInfoHasError,
  selectPlanInfoIsLoading,
} from "../../../store/planInfoSlice";
import DashboardWelcome from "../../../components/dashboard/dashboardWelcome/dashboardWelcome";
import DashboardNavLinks from "../../../components/dashboard/dashboardNavLinks/dashboardNavLinks";
import ErrorWindow from "../../../components/modalWindows/errorWindow/errorWindow";

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
    } else {
      setError(null);
    }
  }, [userInfoHasError, userInfoError]);

  useEffect(() => {
    if (planInfoHasError) {
      setError(planInfoError);
    } else {
      setError(null);
    }
  }, [planInfoHasError, planInfoError]);

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* <I18nextProvider i18n={i18n}> */}
      <div className={styles.dashboardNav}>
        {userInfoFetchComplete && (
          <DashboardWelcome username={userInfo.username} />
        )}
        <DashboardNavLinks onLogout={handleLogout} />
      </div>
      {/* </I18nextProvider> */}
      <div className={styles.dashboardContent}>
        <Outlet />
        {error && (
          <ErrorWindow error={error} dismissHandler={clearUserInfoError} />
        )}
      </div>
    </div>
  );
}
