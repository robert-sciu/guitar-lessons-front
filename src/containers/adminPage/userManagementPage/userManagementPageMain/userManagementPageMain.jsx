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

// import styles from "./userManagementPageMain.module.scss";
// import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import {
  clearAdminPlayInfoError,
  fetchAllPlanInfo,
  selectAdminPlanInfo,
  selectAdminPlanInfoErrorMessage,
  selectAdminPlanInfoErrorStatus,
  selectAdminPlanInfoFetchStatus,
  selectAdminPlanInfoLoadingStatus,
  selectAdminPlanInfoRefetchNeeded,
} from "../../../../store/admin/adminPlanInfoSlice";
import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";
import {
  selectAdminUserInfoPageLoaded,
  setAdminUserInfoPageLoaded,
} from "../../../../store/loadStateSlice";

export default function UserManagementPageMain() {
  const dispatch = useDispatch();

  const dataLoaded = useSelector(selectAdminUserInfoPageLoaded);

  const adminPlanInfo = useSelector(selectAdminPlanInfo);
  const adminPlanInfoIsLoading = useSelector(selectAdminPlanInfoLoadingStatus);
  const adminPlanInfoHasError = useSelector(selectAdminPlanInfoErrorStatus);
  const adminPlanInfoErrorMessage = useSelector(
    selectAdminPlanInfoErrorMessage
  );
  const adminPlanInfoFetchComplete = useSelector(
    selectAdminPlanInfoFetchStatus
  );
  const adminPlanInfoRefetchNeeded = useSelector(
    selectAdminPlanInfoRefetchNeeded
  );

  const adminUserInfo = useSelector(selectAdminUserInfo);
  const adminUserInfoIsLoading = useSelector(selectAdminUserInfoLoadingStatus);
  const adminUserInfoHasError = useSelector(selectAdminUserInfoErrorStatus);
  const adminUserInfoErrorMessage = useSelector(
    selectAdminUserInfoErrorMessage
  );
  const adminUserInfoFetchComplete = useSelector(
    selectAdminUserInfoFetchStatus
  );
  const adminUserInfoRefetchNeeded = useSelector(
    selectAdminUserInfoRefetchNeeded
  );

  useEffect(() => {
    if (
      !adminUserInfoFetchComplete &&
      !adminUserInfoIsLoading &&
      !adminUserInfoHasError
    ) {
      dispatch(fetchAllUsers());
    }
  }, [
    adminUserInfoFetchComplete,
    adminUserInfoIsLoading,
    adminUserInfoHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (
      !adminPlanInfoFetchComplete &&
      !adminPlanInfoIsLoading &&
      !adminPlanInfoHasError
    ) {
      dispatch(fetchAllPlanInfo());
    }
  }, [
    adminPlanInfoFetchComplete,
    adminPlanInfoIsLoading,
    adminPlanInfoHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (adminUserInfoFetchComplete && adminPlanInfoFetchComplete) {
      dispatch(setAdminUserInfoPageLoaded());
    }
  });

  useEffect(() => {
    if (adminUserInfoRefetchNeeded) {
      dispatch(fetchAllUsers());
    }
  }, [adminUserInfoRefetchNeeded, dispatch]);

  useEffect(() => {
    if (adminPlanInfoRefetchNeeded) {
      dispatch(fetchAllPlanInfo());
    }
  }, [adminPlanInfoRefetchNeeded, dispatch]);

  return (
    <DashboardContentContainer
      showContent={
        (adminUserInfoFetchComplete && adminPlanInfoFetchComplete) || dataLoaded
      }
      contentCol={
        adminUserInfo &&
        adminPlanInfo &&
        adminUserInfo.map((user) => (
          <UserDisplayMain
            key={user.id}
            user={user}
            planInfo={adminPlanInfo[user.id]}
          />
        ))
      }
      disableLoadingState={dataLoaded}
      modals={[
        {
          showModal: adminUserInfoHasError,
          modalType: "error",
          data: adminUserInfoErrorMessage,
          onCancel: clearAdminUserInfoError,
        },
        {
          showModal: adminPlanInfoHasError,
          modalType: "error",
          data: adminPlanInfoErrorMessage,
          onCancel: clearAdminPlayInfoError,
        },
      ]}
    />
  );
}
