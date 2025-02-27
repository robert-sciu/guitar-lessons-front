import { useDispatch, useSelector } from "react-redux";
import {
  clearAdminUserInfoError,
  fetchAllUsers,
  selectAdminUserInfo,
  selectAdminUserInfoErrorMessage,
  selectAdminUserInfoErrorStatus,
  selectAdminUserInfoFetchStatus,
  selectAdminUserInfoLoadingStatus,
  selectAdminUserInfoRefetchNeeded,
} from "../../../../store/admin/adminUserInfoSlice";
import { useEffect } from "react";

import UserDisplayMain from "../../../../components/admin/userDisplay/userDisplayMain/userDisplayMain";

import styles from "./userManagementPageMain.module.scss";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import { fetchAllPlanInfo } from "../../../../store/admin/adminPlanInfoSlice";

export default function UserManagementPageMain() {
  const dispatch = useDispatch();

  const adminUserInfo = useSelector(selectAdminUserInfo);
  const isLoading = useSelector(selectAdminUserInfoLoadingStatus);
  const hasError = useSelector(selectAdminUserInfoErrorStatus);
  const errorMessage = useSelector(selectAdminUserInfoErrorMessage);
  const adminUserInfoFetchComplete = useSelector(
    selectAdminUserInfoFetchStatus
  );
  const adminUserInfoRefetchNeeded = useSelector(
    selectAdminUserInfoRefetchNeeded
  );

  useEffect(() => {
    if (!adminUserInfoFetchComplete && !isLoading && !hasError) {
      dispatch(fetchAllUsers());
      dispatch(fetchAllPlanInfo());
    }
  }, [adminUserInfoFetchComplete, isLoading, hasError, dispatch]);

  useEffect(() => {
    if (adminUserInfoRefetchNeeded) {
      dispatch(fetchAllUsers());
    }
  }, [adminUserInfoRefetchNeeded, dispatch]);

  return (
    <div className={styles.mainContainer}>
      {adminUserInfoFetchComplete &&
        adminUserInfo.map((user) => (
          <UserDisplayMain key={user.id} user={user} />
        ))}
      {hasError && (
        <ModalWindowMain
          modalType="error"
          data={errorMessage}
          onClose={clearAdminUserInfoError}
        />
      )}
    </div>
  );
}
