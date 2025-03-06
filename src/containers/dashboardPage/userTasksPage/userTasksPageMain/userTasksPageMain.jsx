import { useSelector } from "react-redux";
import {
  clearTaskToDeleteId,
  clearUserTasksError,
  deleteUserTask,
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

export default function UserTasksPageMain() {
  const { t } = useTranslation();

  const userTasks = useSelector(selectUserTasks);
  const isFetchComplete = useSelector(selectUserTasksFetchStatus);

  useReduxFetch({
    fetchAction: fetchUserTasks,
    fetchCompleteSelector: selectUserTasksFetchStatus,
    loadingSelector: selectUserTasksLoadingStatus,
    errorSelector: selectUserTasksErrorStatus,
    refetchSelector: selectUserTasksRefetchNeeded,
  });

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
          onSubmit: deleteUserTask,
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
