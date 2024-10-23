import { useSelector } from "react-redux";
import styles from "./homePageMain.module.scss";

import {
  selectUserInfo,
  selectUserInfoFetchComplete,
} from "../../../../store/userInfoSlice";
import {
  selectPlanInfo,
  selectPlanInfoFetchComplete,
} from "../../../../store/planInfoSlice";
import UserInfo from "../userInfo/userInfo";
import PlanInfo from "../dashboardPlanInfo/planInfo";
import { useEffect, useState } from "react";

export default function HomePageMain() {
  const [loaded, setLoaded] = useState(false);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);
  const planInfoFetchComplete = useSelector(selectPlanInfoFetchComplete);
  const userInfo = useSelector(selectUserInfo);
  const planInfo = useSelector(selectPlanInfo);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 40);
  }, []);

  return (
    <div
      className={`${styles.dashboardHomePageContainer} ${
        loaded ? styles.show : styles.hide
      }`}
    >
      {userInfoFetchComplete && planInfoFetchComplete && (
        <>
          <div className={styles.dashboardInfoContainer}>
            <UserInfo userInfo={userInfo} />
          </div>
          <div className={styles.dashboardInfoContainer}>
            <PlanInfo planInfo={planInfo} />
          </div>
        </>
      )}
    </div>
  );
}
