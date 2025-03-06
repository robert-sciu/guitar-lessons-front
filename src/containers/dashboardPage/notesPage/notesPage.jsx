import { useSelector } from "react-redux";
import {
  clearUserInfoError,
  fetchUserInfo,
  selectUserInfo,
  selectUserInfoErrorMessage,
  selectUserInfoErrorStatus,
  selectUserInfoFetchStatus,
  selectUserInfoLoadingStatus,
  selectUserRefetchNeeded,
} from "../../../store/userInfoSlice";
import DashboardContentContainer from "../../dashboardContentContainer/DashboardContentContainer";
import useReduxFetch from "../../../hooks/useReduxFetch";

export default function NotesPage() {
  const userInfo = useSelector(selectUserInfo);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchStatus);

  useReduxFetch({
    fetchAction: fetchUserInfo,
    fetchCompleteSelector: selectUserInfoFetchStatus,
    loadingSelector: selectUserInfoLoadingStatus,
    errorSelector: selectUserInfoErrorStatus,
    refetchSelector: selectUserRefetchNeeded,
  });

  return (
    <DashboardContentContainer
      showContent={userInfoFetchComplete}
      contentCol={userInfo.user_notes}
      modals={[
        {
          showModal: useSelector(selectUserInfoErrorStatus),
          modalType: "error",
          data: useSelector(selectUserInfoErrorMessage),
          onCancel: clearUserInfoError,
        },
      ]}
    />
  );
}
