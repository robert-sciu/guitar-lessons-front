import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import LoadingState from "../../../../components/loadingState/loadingState";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";

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

import styles from "./completedUserTasksMain.module.scss";

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
    <div className={styles.mainContainer}>
      {(fetchComplete || dataLoaded) && (
        <>
          <h3>{t("completedTasks.title")}</h3>
          {completedUserTasks.length === 0 && <p>{t("common.nothingHere")}</p>}
          {completedUserTasks.length > 0 &&
            completedUserTasks.map((task) => (
              <TaskDisplay
                key={task.id}
                task={task}
                enableDelete={false}
                showTags={false}
                enableShowMore={true}
              />
            ))}
        </>
      )}
      {hasError && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessage}
          onCancel={clearCompletedUserTasksError}
        />
      )}
      <LoadingState fadeOut={fetchComplete} inactive={dataLoaded} />
    </div>
  );
}
