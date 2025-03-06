import { useSelector } from "react-redux";
import UserInfo from "../userInfo/userInfo";
import PlanInfo from "../planInfo/planInfo";
import {
  cancelEmailChange,
  clearUserInfoError,
  selectEmailChangeConfirmationCodeRequired,
  selectUserInfo,
  selectUserInfoErrorMessage,
  selectUserInfoErrorStatus,
  selectUserInfoFetchStatus,
  updateEmail,
} from "../../../../store/userInfoSlice";

import {
  clearPlanInfoError,
  fetchPlanInfo,
  selectPlanInfo,
  selectPlanInfoErrorMessage,
  selectPlanInfoErrorStatus,
  selectPlanInfoFetchStatus,
  selectPlanInfoLoadingStatus,
} from "../../../../store/planInfoSlice";

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
import { selectAdminPlanInfoRefetchNeeded } from "../../../../store/admin/adminPlanInfoSlice";

export default function HomePageMain() {
  const planInfoFetchComplete = useSelector(selectPlanInfoFetchStatus);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchStatus);
  const pricingInfoFetchComplete = useSelector(selectPricingInfoFetchStatus);

  const planInfo = useSelector(selectPlanInfo);
  const userInfo = useSelector(selectUserInfo);
  const pricingInfo = useSelector(selectPricingInfo);

  useReduxFetch({
    fetchAction: fetchPlanInfo,
    fetchCompleteSelector: selectPlanInfoFetchStatus,
    loadingSelector: selectPlanInfoLoadingStatus,
    errorSelector: selectPlanInfoErrorStatus,
    refetchSelector: selectAdminPlanInfoRefetchNeeded,
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
        planInfoFetchComplete &&
        userInfoFetchComplete &&
        pricingInfoFetchComplete
      }
      isStretchedVertically={true}
      contentCol={<UserInfo userInfo={userInfo} />}
      additionalContentCol={
        <PlanInfo planInfo={planInfo} pricingInfo={pricingInfo} />
      }
      disableLoadingState={
        planInfoFetchComplete &&
        userInfoFetchComplete &&
        pricingInfoFetchComplete
      }
      modals={[
        {
          showModal: useSelector(selectEmailChangeConfirmationCodeRequired),
          modalType: "codeRequired",
          onSubmit: updateEmail,
          onCancel: cancelEmailChange,
        },
        {
          showModal: useSelector(selectUserInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectUserInfoErrorMessage),
          onCancel: clearUserInfoError,
        },
        {
          showModal: useSelector(selectPlanInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectPlanInfoErrorMessage),
          onCancel: clearPlanInfoError,
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
