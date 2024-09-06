import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableTasks,
  selectAvailableTasks,
} from "../../../store/tasksSlice";
import { selectIsLoading } from "../../../store/authSlice";

export default function DashboardAvailableTasksPage() {
  const allAvailableTasks = useSelector(selectAvailableTasks);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAvailableTasks());
  }, [dispatch]);
  return (
    <div>
      <h1>
        {allAvailableTasks?.length > 0 &&
          allAvailableTasks?.map((t) => (
            <div key={t.id}>
              {t.title}, {t.artist}, {t.difficulty_level}
            </div>
          ))}
      </h1>
    </div>
  );
}
