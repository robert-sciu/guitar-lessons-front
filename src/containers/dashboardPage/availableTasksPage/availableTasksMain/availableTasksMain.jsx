import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableTasks,
  selectAvailableTasks,
  selectIsLoadingTasks,
  selectTasksFetchComplete,
  selectTasksHasError,
} from "../../../../store/tasksSlice";
import { selectIsAuthenticated } from "../../../../store/authSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import {
  fetchTags,
  selectFetchTagsComplete,
  selectTags,
} from "../../../../store/tagsSlice";
import TagDisplay from "../../../../components/tagDisplay/tagDisplay";

import styles from "./availableTasksMain.module.scss";
import { useTranslation } from "react-i18next";
import {
  clearUserTaskUpdated,
  selectUserTaskUpdated,
} from "../../../../store/userTasksSlice";

export default function AvailableTasksMain() {
  const [selectedTags, setSelectedTags] = useState([]);
  // const [availableTasks, setAvailableTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  // const userTasksIds = useSelector(selectUserTasksIds);
  const allAvailableTasks = useSelector(selectAvailableTasks);
  const allTags = useSelector(selectTags);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoadingTasks = useSelector(selectIsLoadingTasks);
  const tasksHasError = useSelector(selectTasksHasError);
  const fetchTasksComplete = useSelector(selectTasksFetchComplete);
  const fetchTagsComplete = useSelector(selectFetchTagsComplete);
  const userTaskUpdated = useSelector(selectUserTaskUpdated);
  // const userTasksFetchComplete = useSelector(selectUserTasksFetchComplete);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    if (selectedTags.length > 0) {
      const filteredTasks = allAvailableTasks.filter((task) =>
        selectedTags.every((tag) => task.Tags.some((t) => t.id === tag.id))
      );
      setFilteredTasks(filteredTasks);
    } else {
      const filteredTasks = allAvailableTasks;
      setFilteredTasks(filteredTasks);
    }
  }, [selectedTags, allAvailableTasks]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !fetchTasksComplete &&
      !isLoadingTasks &&
      !tasksHasError
    ) {
      dispatch(fetchAvailableTasks());
    }
  }, [
    dispatch,
    isAuthenticated,
    fetchTasksComplete,
    isLoadingTasks,
    tasksHasError,
  ]);

  useEffect(() => {
    if (isAuthenticated && !fetchTagsComplete) {
      dispatch(fetchTags());
    }
  }, [dispatch, isAuthenticated, fetchTagsComplete]);

  useEffect(() => {
    if (userTaskUpdated) {
      dispatch(clearUserTaskUpdated());
      dispatch(fetchAvailableTasks());
    }
  }, [dispatch, userTaskUpdated]);

  function handleTagClick(tag, selected) {
    if (selected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }
  return (
    <div className={styles.tasksContainer}>
      <h3>{t("availableTasks.title")}</h3>
      <div className={styles.selectedTags}>
        <p>{t("availableTasks.selectedTags")}:</p>
        <div className={styles.tags}>
          {selectedTags.map((tag) => tag.value).join(", ")}
        </div>
      </div>
      <div className={styles.tagsContainer}>
        {fetchTagsComplete &&
          allTags?.length > 0 &&
          allTags.map((tag) => (
            <TagDisplay key={tag.id} tag={tag} onTagClick={handleTagClick} />
          ))}
      </div>
      {fetchTasksComplete && filteredTasks?.length === 0 && (
        <p>No available tasks</p>
      )}
      <div className={styles.tasksList}>
        {filteredTasks?.length > 0 &&
          filteredTasks.map((task) => (
            <TaskDisplay
              key={task.id}
              task={task}
              enableAdd={true}
              showTags={true}
            />
          ))}
      </div>
    </div>
  );
}
