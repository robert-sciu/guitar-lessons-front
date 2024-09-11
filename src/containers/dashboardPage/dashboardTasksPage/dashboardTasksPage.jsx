import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTasks,
  selectFetchComplete,
  selectIsLoadingUserTasks,
  selectUserTasks,
} from "../../../store/userTasksSlice";
import { selectIsAuthenticated } from "../../../store/authSlice";
import TaskDisplay from "../../../components/taskDisplay/taskDisplay";

export default function DashboardTasksPage() {
  const userTasks = useSelector(selectUserTasks);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoadingUserTasks);
  const fetchComplete = useSelector(selectFetchComplete);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && !fetchComplete && userTasks?.length === 0) {
      dispatch(fetchUserTasks());
    }
  }, [dispatch, isAuthenticated, fetchComplete, userTasks?.length]);
  return (
    <div>
      {isLoading && !fetchComplete && <p>Loading...</p>}
      {fetchComplete && userTasks?.length === 0 && <p>No tasks yet</p>}
      {fetchComplete &&
        userTasks?.length > 0 &&
        userTasks.map((task) => (
          <TaskDisplay
            key={task.id}
            task={task}
            enableDelete={true}
            showTags={true}
            showUserNotes={true}
          />
        ))}
    </div>
  );
}
