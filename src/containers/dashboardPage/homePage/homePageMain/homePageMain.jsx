import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import UserInfo from "../userInfo/userInfo";
import PlanInfo from "../planInfo/planInfo";
import LoadingState from "../../../../components/loadingState/loadingState";

import {
  selectUserInfo,
  selectUserInfoFetchStatus,
} from "../../../../store/userInfoSlice";

import {
  fetchPlanInfo,
  selectPlanInfo,
  selectPlanInfoErrorStatus,
  selectPlanInfoFetchStatus,
  selectPlanInfoLoadingStatus,
} from "../../../../store/planInfoSlice";
import {
  selectDashboardHomePageLoaded,
  setDashboardHomePageLoaded,
} from "../../../../store/loadStateSlice";

import styles from "./homePageMain.module.scss";

export default function HomePageMain() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();

  const dataLoaded = useSelector(selectDashboardHomePageLoaded);

  const planInfoIsLoading = useSelector(selectPlanInfoLoadingStatus);
  const planInfoHasError = useSelector(selectPlanInfoErrorStatus);

  const planInfoFetchComplete = useSelector(selectPlanInfoFetchStatus);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchStatus);

  const planInfo = useSelector(selectPlanInfo);
  const userInfo = useSelector(selectUserInfo);

  //user info is fetched at dashboard nav as it's needed in multiple places
  //plan info is fetched here before displaying the main dashboard page

  useEffect(() => {
    if (!planInfoFetchComplete && !planInfoIsLoading && !planInfoHasError) {
      dispatch(fetchPlanInfo());
    }
  }, [planInfoFetchComplete, planInfoIsLoading, planInfoHasError, dispatch]);

  useEffect(() => {
    if (userInfoFetchComplete && planInfoFetchComplete) {
      setFetchComplete(true);
      dispatch(setDashboardHomePageLoaded());
    }
  }, [userInfoFetchComplete, planInfoFetchComplete, dispatch]);

  return (
    <div className={styles.dashboardHomePageContainer}>
      {(fetchComplete || dataLoaded) && (
        <>
          <div className={styles.dashboardInfoContainer}>
            <UserInfo userInfo={userInfo} />
          </div>
          <div className={styles.dashboardInfoContainer}>
            <PlanInfo planInfo={planInfo} />
          </div>
        </>
      )}
      {<LoadingState fadeOut={fetchComplete} inactive={dataLoaded} />}
    </div>
  );
}
