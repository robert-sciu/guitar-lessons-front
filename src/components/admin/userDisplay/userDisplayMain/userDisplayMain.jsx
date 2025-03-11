import Button from "../../../elements/button/button";
import styles from "./userDisplayMain.module.scss";

import propTypes from "prop-types";
import StatusLight from "../../../elements/statusLight/statusLight";
import BasicUserStatusManager from "../basicUserStatusManager/basicUserStatusManager";
import PlanInfoManager from "../planInfoManager/planInfoManager";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdminUserInfoRefetchNeeded,
  selectAdminUserSelectedUserId,
  selectAdminUserShowMoreId,
  setSelectedUser,
  setShowMoreId,
} from "../../../../store/admin/adminUserInfoSlice";
// import NotesManager from "../notesManager/notesManager";
import { setTasksRefetchNeeded } from "../../../../store/tasksSlice";
import { useEffect } from "react";
import { setUserTasksRefetchNeeded } from "../../../../store/userTasksSlice";

export default function UserDisplayMain({ user, planInfo, pricingInfo }) {
  const dispatch = useDispatch();

  const showMoreId = useSelector(selectAdminUserShowMoreId);

  const selectedUserId = useSelector(selectAdminUserSelectedUserId);
  const userIsSelected = selectedUserId === user.id;

  const userIsFullyActivated = user.is_active && user.is_verified;

  const userRefetchNeeded = useSelector(selectAdminUserInfoRefetchNeeded);

  useEffect(() => {
    //if user was updated we need to refetch the tasks. not too pretty but it works
    if (userRefetchNeeded) {
      dispatch(setTasksRefetchNeeded());
    }
  });

  function handleShowMore() {
    dispatch(setShowMoreId(showMoreId === user.id ? null : user.id));
  }

  function handleSelectUser() {
    if (userIsSelected) {
      dispatch(setSelectedUser(null));

      return;
    }
    dispatch(setSelectedUser(user.id));
    dispatch(setTasksRefetchNeeded());
    dispatch(setUserTasksRefetchNeeded());
  }

  return (
    <>
      {(showMoreId === user.id || showMoreId === null) && (
        <div className={styles.userDisplayContainer}>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
          <p>lvl: {user.difficulty_clearance_level}</p>

          {!userIsFullyActivated && (
            <div className={styles.statusContainer}>
              <p>Verification</p>
              <StatusLight isActive={user.is_verified} />
            </div>
          )}
          {userIsFullyActivated && (
            <div className={styles.statusContainer}>
              <p>Selected</p>
              <StatusLight isActive={userIsSelected} />
            </div>
          )}

          {userIsFullyActivated ? (
            <Button
              label={"select"}
              isActive={userIsSelected}
              activeLabel={"deselect"}
              onClick={handleSelectUser}
            />
          ) : (
            <div className={styles.statusContainer}>
              <p>Activation</p>
              <StatusLight isActive={user.is_active} />
            </div>
          )}

          <Button
            label={"details"}
            isActive={showMoreId === user.id}
            activeLabel={"Pokaż mniej"}
            onClick={handleShowMore}
            disabled={user.role === "admin"}
          />
        </div>
      )}
      {showMoreId === user.id && (
        <div className={styles.userManagementPanel}>
          <PlanInfoManager planInfo={planInfo} pricingInfo={pricingInfo} />
          <BasicUserStatusManager user={user} />
          {/* <NotesManager user={user} /> */}
        </div>
      )}
    </>
  );
}

UserDisplayMain.propTypes = {
  user: propTypes.object,
  planInfo: propTypes.object,
  pricingInfo: propTypes.array,
};
