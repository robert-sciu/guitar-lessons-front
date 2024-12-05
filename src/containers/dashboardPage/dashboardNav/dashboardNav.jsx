import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectIsAuthenticated } from "../../../store/authSlice";
import { useEffect, useState } from "react";
import styles from "./dashboardNav.module.scss";
import {
  fetchUserInfo,
  selectUserInfo,
  selectUserInfoFetchComplete,
  selectUserInfoHasError,
  selectUserInfoIsLoading,
  selectUserRefetchNeeded,
} from "../../../store/userInfoSlice";
import DashboardWelcome from "../../../components/dashboard/dashboardWelcome/dashboardWelcome";
import DashboardNavLinks from "../../../components/dashboard/dashboardNavLinks/dashboardNavLinks";
import { classNameFormatter } from "../../../utilities/utilities";

export default function DashboardNav() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const userInfo = useSelector(selectUserInfo);
  const userInfoIsLoading = useSelector(selectUserInfoIsLoading);
  const userInfoHasError = useSelector(selectUserInfoHasError);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);
  const userRefetchNeeded = useSelector(selectUserRefetchNeeded);

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
    if (userRefetchNeeded) {
      dispatch(fetchUserInfo());
    }
  }, [userRefetchNeeded, dispatch]);

  useEffect(() => {
    if (userInfoFetchComplete) {
      setFetchComplete(true);
    }
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
          classNames: ["dashboardNav", fetchComplete ? "show" : "hide"],
        })}
      >
        {fetchComplete && <DashboardWelcome username={userInfo.username} />}
        <DashboardNavLinks onLogout={handleLogout} />
      </div>
      <div className={styles.dashboardContentContainer}>
        <Outlet />
      </div>
    </div>
  );
}
