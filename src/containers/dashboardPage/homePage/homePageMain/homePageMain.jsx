import { useDispatch, useSelector } from "react-redux";
import styles from "./homePageMain.module.scss";

import {
  selectUserInfo,
  selectUserInfoFetchComplete,
} from "../../../../store/userInfoSlice";
import {
  clearPlanInfoError,
  fetchPlanInfo,
  selectPlanInfo,
  selectPlanInfoError,
  selectPlanInfoFetchComplete,
  selectPlanInfoHasError,
  selectPlanInfoIsLoading,
} from "../../../../store/planInfoSlice";
import UserInfo from "../userInfo/userInfo";
import PlanInfo from "../dashboardPlanInfo/planInfo";
import { useEffect, useState } from "react";
import { selectIsAuthenticated } from "../../../../store/authSlice";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import { setTrueWithTimeout } from "../../../../utilities/utilities";
import LoadingState from "../../../../components/loadingState/loadingState";

export default function HomePageMain() {
  const [isloaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const planInfoIsLoading = useSelector(selectPlanInfoIsLoading);
  const planInfoHasError = useSelector(selectPlanInfoHasError);
  const planInfoError = useSelector(selectPlanInfoError);

  const planInfoFetchComplete = useSelector(selectPlanInfoFetchComplete);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);

  const planInfo = useSelector(selectPlanInfo);
  const userInfo = useSelector(selectUserInfo);

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
    if (!userInfoFetchComplete || !planInfoFetchComplete) return;
    setTrueWithTimeout(setIsLoaded, 40);
  }, [userInfoFetchComplete, planInfoFetchComplete]);

  return (
    <div
      className={`${styles.dashboardHomePageContainer} ${
        isloaded ? styles.show : styles.show
      }`}
    >
      {isloaded && (
        <>
          <div className={styles.dashboardInfoContainer}>
            <UserInfo userInfo={userInfo} />
          </div>
          <div className={styles.dashboardInfoContainer}>
            <PlanInfo planInfo={planInfo} />
          </div>
          {planInfoHasError && (
            <ModalWindowMain
              modalType="error"
              data={planInfoError}
              onCancel={clearPlanInfoError}
            />
          )}
        </>
      )}
      {<LoadingState fadeOut={isloaded} />}
    </div>
  );
}
