import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  selectCompletedUserTasksPageLoaded,
  setCompletedUserTasksPageLoaded,
} from "../../../../store/loadStateSlice";

import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";

export default function UserTasksPageMain() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const dataLoaded = useSelector(selectCompletedUserTasksPageLoaded);

  const completedUserTasks = useSelector(selectCompletedUserTasks);
  const isLoading = useSelector(selectCompletedUserTasksLoadingStatus);
  const isFetchComplete = useSelector(selectCompletedUserTasksFetchStatus);
  const needsRefetch = useSelector(selectCompletedUserTasksRefetchNeeded);
  const hasError = useSelector(selectCompletedUserTasksErrorStatus);
  const errorMessage = useSelector(selectCompletedUserTasksErrorMessage);

  useEffect(() => {
    if (!isFetchComplete && !isLoading && !hasError) {
      dispatch(fetchCompletedUserTasks());
    }
  }, [dispatch, isFetchComplete, isLoading, hasError]);

  useEffect(() => {
    if (needsRefetch) {
      dispatch(fetchCompletedUserTasks());
    }
  }, [needsRefetch, dispatch]);

  useEffect(() => {
    if (isFetchComplete) {
      setFetchComplete(true);
      dispatch(setCompletedUserTasksPageLoaded());
    }
  }, [isFetchComplete, dispatch]);

  return (
    <DashboardContentContainer
      showContent={fetchComplete || dataLoaded}
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
      disableLoadingState={dataLoaded}
      modals={[
        {
          showModal: hasError,
          modalType: "error",
          onCancel: clearCompletedUserTasksError,
          data: errorMessage,
        },
      ]}
    />
  );
}
