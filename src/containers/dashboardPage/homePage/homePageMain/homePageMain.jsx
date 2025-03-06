import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import UserInfo from "../userInfo/userInfo";
import PlanInfo from "../planInfo/planInfo";
// import LoadingState from "../../../../components/loadingState/loadingState";

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
import {
  selectDashboardHomePageLoaded,
  setDashboardHomePageLoaded,
} from "../../../../store/loadStateSlice";

// import styles from "./homePageMain.module.scss";
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

export default function HomePageMain() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();

  const dataLoaded = useSelector(selectDashboardHomePageLoaded);

  const planInfoIsLoading = useSelector(selectPlanInfoLoadingStatus);
  const pricingInfoIsLoading = useSelector(selectPricingInfoLoadingStatus);

  const planInfoFetchComplete = useSelector(selectPlanInfoFetchStatus);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchStatus);
  const pricingInfoFetchComplete = useSelector(selectPricingInfoFetchStatus);

  const planInfo = useSelector(selectPlanInfo);
  const userInfo = useSelector(selectUserInfo);
  const pricingInfo = useSelector(selectPricingInfo);

  const emailChangeConfirmationCodeRequired = useSelector(
    selectEmailChangeConfirmationCodeRequired
  );
  const userInfoHasError = useSelector(selectUserInfoErrorStatus);
  const userInfoError = useSelector(selectUserInfoErrorMessage);
  const planInfoHasError = useSelector(selectPlanInfoErrorStatus);
  const planInfoError = useSelector(selectPlanInfoErrorMessage);

  const pricingInfoHasError = useSelector(selectPricingInfoErrorStatus);
  const pricingInfoError = useSelector(selectPricingInfoErrorMessage);

  //user info is fetched at dashboard nav as it's needed in multiple places
  //plan info is fetched here before displaying the main dashboard page

  useEffect(() => {
    if (!planInfoFetchComplete && !planInfoIsLoading && !planInfoHasError) {
      dispatch(fetchPlanInfo());
    }
  }, [planInfoFetchComplete, planInfoIsLoading, planInfoHasError, dispatch]);

  useEffect(() => {
    if (
      !pricingInfoFetchComplete &&
      !pricingInfoIsLoading &&
      !pricingInfoHasError
    ) {
      dispatch(fetchPricingInfo());
    }
  });

  useEffect(() => {
    if (userInfoFetchComplete && planInfoFetchComplete) {
      setFetchComplete(true);
      dispatch(setDashboardHomePageLoaded());
    }
  }, [userInfoFetchComplete, planInfoFetchComplete, dispatch]);

  return (
    <DashboardContentContainer
      showContent={fetchComplete || dataLoaded}
      isStretchedVertically={true}
      contentCol={<UserInfo userInfo={userInfo} />}
      additionalContentCol={
        <PlanInfo planInfo={planInfo} pricingInfo={pricingInfo} />
      }
      disableLoadingState={dataLoaded}
      modals={[
        {
          showModal: emailChangeConfirmationCodeRequired,
          modalType: "codeRequired",
          onSubmit: updateEmail,
          onCancel: cancelEmailChange,
        },
        {
          showModal: userInfoHasError,
          modalType: "error",
          data: userInfoError,
          onCancel: clearUserInfoError,
        },
        {
          showModal: planInfoHasError,
          modalType: "error",
          data: planInfoError,
          onCancel: clearPlanInfoError,
        },
        {
          showModal: pricingInfoHasError,
          modalType: "error",
          data: pricingInfoError,
          onCancel: clearPricingInfoError,
        },
      ]}
    />
  );
}
