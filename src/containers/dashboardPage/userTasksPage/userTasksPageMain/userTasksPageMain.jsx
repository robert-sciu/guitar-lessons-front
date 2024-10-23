import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTasks,
  selectUserTasks,
  selectUserTasksFetchComplete,
} from "../../../../store/userTasksSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import styles from "./userTasksPageMain.module.scss";
import { useTranslation } from "react-i18next";
import { selectIsAuthenticated } from "../../../../store/authSlice";

export default function UserTasksPageMain() {
  const [userTasksState, setUserTasksState] = useState([]);
  // const userTasks = useSelector(selectUserTasks);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // const isLoading = useSelector(selectIsLoadingUserTasks);
  const fetchComplete = useSelector(selectUserTasksFetchComplete);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchedUserTasks = useSelector(selectUserTasks);
  const userTasksFetchComplete = useSelector(selectUserTasksFetchComplete);

  useEffect(() => {
    if (isAuthenticated && !fetchComplete && fetchedUserTasks?.length === 0) {
      dispatch(fetchUserTasks());
    }
  }, [dispatch, isAuthenticated, fetchComplete, fetchedUserTasks]);

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
      {/* {isLoading && !userTasksFetchComplete && <p>Loading...</p>} */}
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
    </div>
  );
}
