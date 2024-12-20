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
import DashboardNavLinks from "../../../components/dashboard/dashboardNavLinks/dashboardNavLinks";
import DashboardNavContainer from "../../../components/dashboardNavContainer/dashboardNavContainer";

export default function DashboardNav() {
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
  });

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
    <DashboardNavContainer
      dashboardWelcome={<DashboardWelcome username={userInfo.username} />}
      navLinks={
        <DashboardNavLinks
          onLogout={handleLogout}
          showAdminLink={userInfo?.role === "admin"}
        />
      }
      fetchComplete={fetchComplete}
    />
  );
}
