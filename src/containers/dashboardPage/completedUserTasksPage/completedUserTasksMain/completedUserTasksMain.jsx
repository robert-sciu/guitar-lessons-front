import { useTranslation } from "react-i18next";

import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";

import {
  clearCompletedUserTasksError,
  fetchCompletedUserTasks,
  selectCompletedUserTasks,
  selectCompletedUserTasksErrorMessage,
  selectCompletedUserTasksErrorStatus,
  selectCompletedUserTasksFetchStatus,
  selectCompletedUserTasksLoadingStatus,
  selectCompletedUserTasksRefetchNeeded,
} from "../../../../store/completedUserTasksSlice";

import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";
import useReduxFetch from "../../../../hooks/useReduxFetch";
import { useSelector } from "react-redux";

import PropTypes from "prop-types";
import { selectAdminUserSelectedUserId } from "../../../../store/admin/adminUserInfoSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompletedUserTasksPageMain({ isAdmin = false }) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const completedUserTasks = useSelector(selectCompletedUserTasks);
  const isFetchComplete = useSelector(selectCompletedUserTasksFetchStatus);

  const selectedUserId = useSelector(selectAdminUserSelectedUserId);

  useReduxFetch({
    fetchAction:
      !selectedUserId && isAdmin ? undefined : fetchCompletedUserTasks,
    fetchData:
      selectedUserId && isAdmin ? { isAdmin, userId: selectedUserId } : {},
    fetchCompleteSelector: selectCompletedUserTasksFetchStatus,
    loadingSelector: selectCompletedUserTasksLoadingStatus,
    errorSelector: selectCompletedUserTasksErrorStatus,
    refetchSelector: selectCompletedUserTasksRefetchNeeded,
  });

  useEffect(() => {
    if (isAdmin && !selectedUserId) {
      navigate("/admin/userManagement");
    }
  }, [isAdmin, selectedUserId, navigate]);

  return (
    <DashboardContentContainer
      showContent={isFetchComplete}
      contentHeader={t("completedTasks.title")}
      contentSubHeader={
        completedUserTasks?.length === 0 && t("common.nothingHere")
      }
      contentCol={completedUserTasks?.map((task) => (
        <TaskDisplay
          key={task.id}
          task={task}
          enableDelete={false}
          showTags={false}
          enableShowMore={true}
        />
      ))}
      disableLoadingState={isFetchComplete}
      modals={[
        {
          showModal: useSelector(selectCompletedUserTasksErrorStatus),
          modalType: "error",
          onCancel: clearCompletedUserTasksError,
          data: useSelector(selectCompletedUserTasksErrorMessage),
        },
      ]}
    />
  );
}

CompletedUserTasksPageMain.propTypes = {
  isAdmin: PropTypes.bool,
};
