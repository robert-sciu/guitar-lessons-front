import Button from "../../../elements/button/button";
import styles from "./userDisplayMain.module.scss";

import propTypes from "prop-types";
// import UserManagementPanel from "../userManagementPanel/userManagementPanel";
import StatusLight from "../../../elements/statusLight/statusLight";
import BasicUserStatusManager from "../basicUserStatusManager/basicUserStatusManager";
import PlanInfoManager from "../planInfoManager/planInfoManager";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdminUserShowMoreId,
  setShowMoreId,
} from "../../../../store/admin/adminUserInfoSlice";

export default function UserDisplayMain({ user, planInfo }) {
  const dispatch = useDispatch();

  const showMoreId = useSelector(selectAdminUserShowMoreId);

  function handleShowMore() {
    dispatch(setShowMoreId(showMoreId === user.id ? null : user.id));
  }

  return (
    <>
      {(showMoreId === user.id || showMoreId === null) && (
        <div className={styles.userDisplayContainer}>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
          <p>lvl: {user.difficulty_clearance_level}</p>
          <div className={styles.statusContainer}>
            <p>verification</p>
            <StatusLight isActive={user.is_verified} />
          </div>
          <div className={styles.statusContainer}>
            <p>activation</p>
            <StatusLight isActive={user.is_active} />
          </div>

          <Button
            label={"Pokaż więcej"}
            isActive={showMoreId === user.id}
            activeLabel={"Pokaż mniej"}
            onClick={handleShowMore}
            disabled={user.role === "admin"}
          />
          {/* {showMore && <UserManagementPanel user={user} planInfo={planInfo} />} */}
        </div>
      )}
      {showMoreId === user.id && (
        <div className={styles.userManagementPanel}>
          <BasicUserStatusManager user={user} />
          <PlanInfoManager planInfo={planInfo} />
        </div>
      )}
    </>
  );
}

UserDisplayMain.propTypes = {
  user: propTypes.object,
  planInfo: propTypes.object,
};
