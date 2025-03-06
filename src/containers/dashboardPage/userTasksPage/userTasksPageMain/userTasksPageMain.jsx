import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
// import styles from "./userTasksPageMain.module.scss";
import { useTranslation } from "react-i18next";
// import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import {
  selectUserTasksPageLoaded,
  setUserTasksPageLoaded,
} from "../../../../store/loadStateSlice";
// import LoadingState from "../../../../components/loadingState/loadingState";
import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";

export default function UserTasksPageMain() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const dataLoaded = useSelector(selectUserTasksPageLoaded);

  const userTasks = useSelector(selectUserTasks);
  const isLoading = useSelector(selectUserTasksLoadingStatus);
  const isFetchComplete = useSelector(selectUserTasksFetchStatus);
  const hasError = useSelector(selectUserTasksErrorStatus);
  const errorMessage = useSelector(selectUserTasksErrorMessage);
  const taskToDeleteId = useSelector(selectUserTaskToDeleteId);
  // const userTasksFetchComplete = useSelector(selectUserTasksFetchComplete);
  const userTasksRefetchNeeded = useSelector(selectUserTasksRefetchNeeded);

  useEffect(() => {
    if (!isFetchComplete && !isLoading && !hasError) {
      dispatch(fetchUserTasks());
    }
  }, [isFetchComplete, isLoading, hasError, dispatch]);

  useEffect(() => {
    if (userTasksRefetchNeeded) {
      dispatch(fetchUserTasks());
    }
  });

  useEffect(() => {
    if (isFetchComplete) {
      setFetchComplete(true);
      dispatch(setUserTasksPageLoaded());
    }
  }, [isFetchComplete, dispatch]);

  return (
    <DashboardContentContainer
      showContent={fetchComplete || dataLoaded}
      contentHeader={t("myTasks.title")}
      contentSubHeader={userTasks?.length === 0 && t("common.nothingHere")}
      contentCol={userTasks?.map((task) => (
        <TaskDisplay
          key={task.id}
          task={task}
          enableDelete={true}
          showTags={true}
          enableShowMore={true}
        />
      ))}
      disableLoadingState={dataLoaded}
      modals={[
        {
          showModal: taskToDeleteId,
          modalType: "taskDelete",
          onSubmit: deleteUserTask,
          onCancel: clearTaskToDeleteId,
          data: taskToDeleteId,
        },
        {
          showModal: hasError,
          modalType: "error",
          onCancel: clearUserTasksError,
          data: errorMessage,
        },
      ]}
    />
  );
}
