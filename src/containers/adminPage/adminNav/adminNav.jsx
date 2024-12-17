import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectAuthAuthenticationStatus,
  selectAuthTokenVerificationStatus,
} from "../../../store/authSlice";
import { useEffect, useState } from "react";
import {
  fetchUserInfo,
  selectUserInfo,
  selectUserInfoErrorStatus,
  selectUserInfoFetchStatus,
  selectUserInfoLoadingStatus,
  selectUserRefetchNeeded,
} from "../../../store/userInfoSlice";
import DashboardWelcome from "../../../components/dashboard/dashboardWelcome/dashboardWelcome";
import AdminNavLinks from "../../../components/admin/adminNavLinks/adminNavLinks";
import DashboardNavContainer from "../../../components/dashboardNavContainer/dashboardNavContainer";

export default function AdminNav() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectAuthAuthenticationStatus);

  const userInfo = useSelector(selectUserInfo);
  const userInfoIsLoading = useSelector(selectUserInfoLoadingStatus);
  const userInfoHasError = useSelector(selectUserInfoErrorStatus);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchStatus);
  const userRefetchNeeded = useSelector(selectUserRefetchNeeded);

  const tokenVerificationComplete = useSelector(
    selectAuthTokenVerificationStatus
  );

  useEffect(() => {
    if (
      tokenVerificationComplete &&
      isAuthenticated &&
      !userInfoFetchComplete &&
      !userInfoIsLoading &&
      !userInfoHasError
    ) {
      dispatch(fetchUserInfo());
    }
  }, [
    tokenVerificationComplete,
    isAuthenticated,
    userInfoFetchComplete,
    userInfoIsLoading,
    userInfoHasError,
    dispatch,
    navigate,
  ]);

  useEffect(() => {
    if (tokenVerificationComplete && !isAuthenticated) {
      navigate("/login");
    }
  }, [tokenVerificationComplete, isAuthenticated, navigate, userInfo]);

  useEffect(() => {
    if (userRefetchNeeded) {
      dispatch(fetchUserInfo());
    }
  }, [userRefetchNeeded, dispatch]);

  useEffect(() => {
    if (userInfoFetchComplete) {
      if (userInfo.role !== "admin") {
        navigate("/");
      }
      setFetchComplete(true);
    }
  }, [userInfoFetchComplete, userInfo, navigate]);

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    // <div className={styles.dashboardContainer}>
    //   <div
    //     className={classNameFormatter({
    //       styles,
    //       classNames: ["dashboardNav", fetchComplete ? "show" : "hide"],
    //     })}
    //   >
    //     {fetchComplete && <DashboardWelcome username={userInfo.username} />}
    //     <AdminNavLinks onLogout={handleLogout} />
    //   </div>
    //   <div className={styles.dashboardContentContainer}>
    //     {fetchComplete && <Outlet />}
    //   </div>
    // </div>
    <DashboardNavContainer
      dashboardWelcome={<DashboardWelcome username={`Ekscelencjo`} />}
      navLinks={<AdminNavLinks onLogout={handleLogout} />}
      fetchComplete={fetchComplete}
    />
  );
}
