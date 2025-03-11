import { useSelector } from "react-redux";
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
  clearPricingInfoError,
  fetchPricingInfo,
  selectPricingInfo,
  selectPricingInfoErrorMessage,
  selectPricingInfoErrorStatus,
  selectPricingInfoFetchStatus,
  selectPricingInfoLoadingStatus,
} from "../../../../store/pricingInfoSlice";
import useReduxFetch from "../../../../hooks/useReduxFetch";

export default function UserManagementPageMain() {
  const adminPlanInfo = useSelector(selectAdminPlanInfo);
  const adminPlanInfoFetchComplete = useSelector(
    selectAdminPlanInfoFetchStatus
  );
  const pricingInfo = useSelector(selectPricingInfo);
  const pricingInfoFetchComplete = useSelector(selectPricingInfoFetchStatus);
  const adminUserInfo = useSelector(selectAdminUserInfo);
  const adminUserInfoFetchComplete = useSelector(
    selectAdminUserInfoFetchStatus
  );

  useReduxFetch({
    fetchAction: fetchAllPlanInfo,
    fetchCompleteSelector: selectAdminPlanInfoFetchStatus,
    loadingSelector: selectAdminPlanInfoLoadingStatus,
    errorSelector: selectAdminPlanInfoErrorStatus,
    refetchSelector: selectAdminPlanInfoRefetchNeeded,
  });

  useReduxFetch({
    fetchAction: fetchAllUsers,
    fetchCompleteSelector: selectAdminUserInfoFetchStatus,
    loadingSelector: selectAdminUserInfoLoadingStatus,
    errorSelector: selectAdminUserInfoErrorStatus,
    refetchSelector: selectAdminUserInfoRefetchNeeded,
  });

  useReduxFetch({
    fetchAction: fetchPricingInfo,
    fetchCompleteSelector: selectPricingInfoFetchStatus,
    loadingSelector: selectPricingInfoLoadingStatus,
    errorSelector: selectPricingInfoErrorStatus,
  });

  return (
    <DashboardContentContainer
      showContent={
        adminUserInfoFetchComplete &&
        adminPlanInfoFetchComplete &&
        pricingInfoFetchComplete
      }
      contentCol={
        adminUserInfo &&
        adminPlanInfo &&
        adminUserInfo.map((user) => (
          <UserDisplayMain
            key={user.id}
            user={user}
            planInfo={adminPlanInfo[user.id]}
            pricingInfo={pricingInfo}
          />
        ))
      }
      disableLoadingState={
        adminUserInfoFetchComplete &&
        adminPlanInfoFetchComplete &&
        pricingInfoFetchComplete
      }
      modals={[
        {
          showModal: useSelector(selectAdminUserInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectAdminUserInfoErrorMessage),
          onCancel: clearAdminUserInfoError,
        },
        {
          showModal: useSelector(selectAdminPlanInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectAdminPlanInfoErrorMessage),
          onCancel: clearAdminPlayInfoError,
        },
        {
          showModal: useSelector(selectPricingInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectPricingInfoErrorMessage),
          onCancel: clearPricingInfoError,
        },
      ]}
    />
  );
}
