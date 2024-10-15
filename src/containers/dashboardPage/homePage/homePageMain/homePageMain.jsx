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

export default function HomePageMain() {
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);
  const planInfoFetchComplete = useSelector(selectPlanInfoFetchComplete);
  const userInfo = useSelector(selectUserInfo);
  const planInfo = useSelector(selectPlanInfo);

  return (
    <>
      {(!userInfoFetchComplete || !planInfoFetchComplete) && "Loading..."}
      {userInfoFetchComplete && planInfoFetchComplete && (
        <div className={styles.dashboardHomePageContainer}>
          <div className={styles.dashboardInfoContainer}>
            <UserInfo userInfo={userInfo} />
          </div>
          <div className={styles.dashboardInfoContainer}>
            <PlanInfo planInfo={planInfo} />
          </div>
        </div>
      )}
    </>
  );
}
