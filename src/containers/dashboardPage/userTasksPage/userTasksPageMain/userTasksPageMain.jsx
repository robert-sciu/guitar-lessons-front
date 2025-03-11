import { useSelector } from "react-redux";
import {
  clearTaskToDeleteId,
  clearUserTasksError,
  deleteUserTask,
  deleteUserTaskAdmin,
  fetchUserTasks,
  selectUserTasks,
  selectUserTasksErrorMessage,
  selectUserTasksErrorStatus,
  selectUserTasksFetchStatus,
  selectUserTasksLoadingStatus,
  selectUserTasksRefetchNeeded,
  selectUserTaskToDeleteId,
} from "../../../../store/userTasksSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import { useTranslation } from "react-i18next";
import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";
import useReduxFetch from "../../../../hooks/useReduxFetch";
import { selectAdminUserSelectedUserId } from "../../../../store/admin/adminUserInfoSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

export default function UserTasksPageMain({ isAdmin = false }) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const userTasks = useSelector(selectUserTasks);
  const isFetchComplete = useSelector(selectUserTasksFetchStatus);

  const selectedUserId = useSelector(selectAdminUserSelectedUserId);

  useReduxFetch({
    fetchAction: !selectedUserId && isAdmin ? undefined : fetchUserTasks,
    fetchData:
      selectedUserId && isAdmin ? { isAdmin, userId: selectedUserId } : {},
    fetchCompleteSelector: selectUserTasksFetchStatus,
    loadingSelector: selectUserTasksLoadingStatus,
    errorSelector: selectUserTasksErrorStatus,
    refetchSelector: selectUserTasksRefetchNeeded,
  });

  useEffect(() => {
    if (isAdmin && !selectedUserId) {
      navigate("/admin/userManagement");
    }
  }, [isAdmin, selectedUserId, navigate]);

  return (
    <DashboardContentContainer
      showContent={isFetchComplete}
      contentHeader={t("myTasks.title")}
      contentSubHeader={userTasks?.length === 0 && t("common.nothingHere")}
      contentCol={userTasks?.map((task) => (
        <TaskDisplay
          key={task.id}
          task={task}
          enableDelete={true}
          showTags={false}
          enableShowMore={true}
        />
      ))}
      disableLoadingState={isFetchComplete}
      modals={[
        {
          showModal: useSelector(selectUserTaskToDeleteId),
          modalType: "taskDelete",
          onSubmit: isAdmin ? deleteUserTaskAdmin : deleteUserTask,
          onCancel: clearTaskToDeleteId,
          data: useSelector(selectUserTaskToDeleteId),
        },
        {
          showModal: useSelector(selectUserTasksErrorStatus),
          modalType: "error",
          onCancel: clearUserTasksError,
          data: useSelector(selectUserTasksErrorMessage),
        },
      ]}
    />
  );
}

UserTasksPageMain.propTypes = {
  isAdmin: PropTypes.bool,
};
