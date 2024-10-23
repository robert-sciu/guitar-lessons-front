import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompletedTasks,
  selectCompletedTasks,
  selectCompletedTasksFetchComplete,
} from "../../../../store/userTasksSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import styles from "./completedUserTasksMain.module.scss";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../../../store/authSlice";

export default function UserTasksPageMain() {
  const [completedUserTasksState, setCompletedUserTasksState] = useState([]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchedCompletedUserTasks = useSelector(selectCompletedTasks);
  const completedUserTasksFetchComplete = useSelector(
    selectCompletedTasksFetchComplete
  );

  useEffect(() => {
    if (
      isAuthenticated &&
      !completedUserTasksFetchComplete &&
      fetchedCompletedUserTasks?.length === 0
    ) {
      dispatch(fetchCompletedTasks());
    }
  }, [
    dispatch,
    isAuthenticated,
    fetchedCompletedUserTasks,
    completedUserTasksFetchComplete,
  ]);

  useEffect(() => {
    if (fetchedCompletedUserTasks?.length > 0) {
      setCompletedUserTasksState(fetchedCompletedUserTasks);
    } else {
      setCompletedUserTasksState([]);
    }
  }, [fetchedCompletedUserTasks]);

  return (
    <div className={styles.myTasksPageMainContainer}>
      <h3>{t("completedTasks.title")}</h3>
      {completedUserTasksFetchComplete &&
        completedUserTasksState?.length === 0 && <p>No tasks yet</p>}
      {completedUserTasksState?.length > 0 &&
        completedUserTasksState.map((task) => (
          <TaskDisplay
            key={task.id}
            task={task}
            enableDelete={false}
            showTags={false}
            enableShowMore={true}
          />
        ))}
    </div>
  );
}
