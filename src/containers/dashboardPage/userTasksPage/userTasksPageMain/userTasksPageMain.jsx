import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserTasksError,
  fetchUserTasks,
  selectUserTasks,
  selectUserTasksErrorMessage,
  selectUserTasksErrorStatus,
  selectUserTasksFetchStatus,
  selectUserTasksLoadingStatus,
  selectUserTasksRefetchNeeded,
} from "../../../../store/userTasksSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import styles from "./userTasksPageMain.module.scss";
import { useTranslation } from "react-i18next";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import {
  selectUserTasksPageLoaded,
  setUserTasksPageLoaded,
} from "../../../../store/loadStateSlice";
import LoadingState from "../../../../components/loadingState/loadingState";

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
    <div className={styles.mainContainer}>
      {(fetchComplete || dataLoaded) && (
        <>
          <h3>{t("myTasks.title")}</h3>
          {userTasks?.length === 0 && <p>No tasks yet</p>}
          {userTasks?.length > 0 &&
            userTasks.map((task) => (
              <TaskDisplay
                key={task.id}
                task={task}
                enableDelete={true}
                showTags={true}
                enableShowMore={true}
              />
            ))}
        </>
      )}
      {hasError && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessage}
          onCancel={clearUserTasksError}
        />
      )}
      <LoadingState fadeOut={fetchComplete} inactive={dataLoaded} />
    </div>
  );
}
