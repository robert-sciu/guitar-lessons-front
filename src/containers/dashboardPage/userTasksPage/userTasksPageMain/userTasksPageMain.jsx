import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserTasksError,
  fetchUserTasks,
  selectUserTasks,
  selectUserTasksError,
  selectUserTasksFetchComplete,
  selectUserTasksHasError,
  selectUserTasksIsLoading,
  selectUserTasksRefetchNeeded,
} from "../../../../store/userTasksSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import styles from "./userTasksPageMain.module.scss";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../../../store/authSlice";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";

export default function UserTasksPageMain() {
  const [userTasksState, setUserTasksState] = useState([]);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const fetchedUserTasks = useSelector(selectUserTasks);
  const userTaskIsLoading = useSelector(selectUserTasksIsLoading);
  const userTaskHasError = useSelector(selectUserTasksHasError);
  const userTaskError = useSelector(selectUserTasksError);
  const userTaskFetchComplete = useSelector(selectUserTasksFetchComplete);
  const userTasksFetchComplete = useSelector(selectUserTasksFetchComplete);
  const userTasksRefetchNeeded = useSelector(selectUserTasksRefetchNeeded);

  useEffect(() => {
    if (
      isAuthenticated &&
      !userTaskFetchComplete &&
      !userTaskIsLoading &&
      !userTaskHasError
    ) {
      dispatch(fetchUserTasks());
    }
  }, [
    isAuthenticated,
    userTaskFetchComplete,
    userTaskIsLoading,
    userTaskHasError,
    dispatch,
  ]);

  useEffect(() => {
    if (userTasksRefetchNeeded) {
      dispatch(fetchUserTasks());
    }
  });

  useEffect(() => {
    if (fetchedUserTasks?.length > 0) {
      setUserTasksState(fetchedUserTasks);
    } else {
      setUserTasksState([]);
    }
  }, [fetchedUserTasks]);

  return (
    <div className={styles.myTasksPageMainContainer}>
      <h3>{t("myTasks.title")}</h3>
      {userTasksFetchComplete && userTasksState?.length === 0 && (
        <p>No tasks yet</p>
      )}
      {userTasksState?.length > 0 &&
        userTasksState.map((task) => (
          <TaskDisplay
            key={task.id}
            task={task}
            enableDelete={true}
            showTags={true}
            enableShowMore={true}
          />
        ))}
      {userTaskHasError && (
        <ModalWindowMain
          modalType={"error"}
          data={userTaskError}
          onCancel={clearUserTasksError}
        />
      )}
    </div>
  );
}
