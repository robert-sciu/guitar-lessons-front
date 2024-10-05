import { useSelector } from "react-redux";
import styles from "./dashboardWelcomePage.module.scss";
import {
  selectPlanInfo,
  selectPlanInfoFetchComplete,
} from "../../../store/planInfoSlice";
import {
  selectUserInfo,
  selectUserInfoFetchComplete,
} from "../../../store/userInfoSlice";
import DashboardInfo from "../../../components/dashboardInfo/dashboardInfo";

export default function DashboardWelcomePage() {
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);
  const planInfoFetchComplete = useSelector(selectPlanInfoFetchComplete);
  const userInfo = useSelector(selectUserInfo);
  const planInfo = useSelector(selectPlanInfo);

  return (
    <div className={styles.dashboardWelcomePage}>
      {!userInfoFetchComplete || (!planInfoFetchComplete && "Loading...")}
      {userInfoFetchComplete && planInfoFetchComplete && (
        <DashboardInfo userInfo={userInfo} planInfo={planInfo} />
      )}
    </div>
  );
}
