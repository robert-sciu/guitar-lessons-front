import { useEffect, useRef, useState } from "react";
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
import {
  selectUserId,
  selectUserInfoFetchComplete,
  selectUserInfoIsLoading,
  selectUserMinimumTaskLevel,
  updateUser,
} from "../../../../store/userInfoSlice";
import { debounce } from "lodash";
import LoadingState from "../../../../components/loadingState/loadingState";

export default function AvailableTasksMain() {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [minimumTaskLevel, setMinimumTaskLevel] = useState(0);
  const [minimumTaskLevelSaving, setMinimumTaskLevelSaving] = useState(false);
  const allAvailableTasks = useSelector(selectAvailableTasks);
  const allTags = useSelector(selectTags);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoadingTasks = useSelector(selectIsLoadingTasks);
  const tasksHasError = useSelector(selectTasksHasError);
  const fetchTasksComplete = useSelector(selectTasksFetchComplete);
  const fetchTagsComplete = useSelector(selectFetchTagsComplete);
  const userTaskUpdated = useSelector(selectUserTaskUpdated);
  const minimumTaskLevelToDisplay = useSelector(selectUserMinimumTaskLevel);
  const userInfoFetchComplete = useSelector(selectUserInfoFetchComplete);
  const userInfoIsLoading = useSelector(selectUserInfoIsLoading);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const debauncedSaveMinimumTaskLevel = useRef(
    debounce((level, id) => {
      const data = { minimum_task_level_to_display: level, id };
      dispatch(updateUser(data));
      setMinimumTaskLevelSaving(false);
    }, 1500)
  ).current;

  useEffect(() => {
    if (
      userInfoFetchComplete &&
      userInfoIsLoading &&
      minimumTaskLevel !== minimumTaskLevelToDisplay
    ) {
      dispatch(fetchAvailableTasks());
    }
  });

  useEffect(() => {
    if (userInfoFetchComplete) {
      setMinimumTaskLevel(minimumTaskLevelToDisplay);
    }
  }, [userInfoFetchComplete, minimumTaskLevelToDisplay]);

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

  // useEffect(() => {
  //   if (!userInfoFetchComplete || minimumTaskLevel === 0) return;
  //   if (minimumTaskLevel !== minimumTaskLevelToDisplay) {
  //     dispatch(updateUser({ minimum_task_level_to_display: minimumTaskLevel }));
  //   }
  // }, [
  //   dispatch,
  //   minimumTaskLevel,
  //   minimumTaskLevelToDisplay,
  //   userInfoFetchComplete,
  // ]);

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
  function handleMinimumTaskLevelChange(e) {
    // if (minimumTaskLevel <= 1) return;
    const value = e?.target?.value || e;
    if (value <= 0) return;
    if (/^\d+$/.test(value)) {
      setMinimumTaskLevelSaving(true);
      setMinimumTaskLevel(parseInt(value));
      debauncedSaveMinimumTaskLevel(value, userId);
    }
  }
  return (
    <div className={styles.tasksContainer}>
      <div className={styles.availableTasksHeader}>
        <h4>{t("availableTasks.title")}</h4>
        {/* <div className={styles.selectedTags}>
        <p>{t("availableTasks.selectedTags")}:</p>
        <div className={styles.tags}>
        {selectedTags.map((tag) => tag.value).join(", ")}
        </div>
        </div> */}
        <div className={styles.levelFilter}>
          {minimumTaskLevelSaving && (
            <div className={styles.levelSaving}>
              <LoadingState spinnerOnly={true} size="Xl" />
              <p>{t("availableTasks.saving")}</p>
            </div>
          )}
          <p>{t("availableTasks.levelFilter")}:</p>
          <input
            className={styles.levelInput}
            type="text"
            value={minimumTaskLevel}
            onChange={handleMinimumTaskLevelChange}
          />
          <button
            className={styles.levelButtons}
            onClick={() => handleMinimumTaskLevelChange(minimumTaskLevel - 1)}
          >
            -
          </button>
          <button
            className={styles.levelButtons}
            onClick={() => handleMinimumTaskLevelChange(minimumTaskLevel + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.tagsContainer}>
        <p>{t("availableTasks.tags")}:</p>
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
