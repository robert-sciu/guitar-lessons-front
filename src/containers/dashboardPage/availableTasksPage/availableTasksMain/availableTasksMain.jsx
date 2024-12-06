import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import LoadingState from "../../../../components/loadingState/loadingState";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import {
  clearUserTaskUpdated,
  selectUserTaskUpdated,
} from "../../../../store/userTasksSlice";
import { selectUserInfoMinimumDifficultyLevel } from "../../../../store/userInfoSlice";
import {
  selectAvailableTasksPageLoaded,
  setAvailableTasksPageLoaded,
} from "../../../../store/loadStateSlice";
import {
  clearTasksError,
  fetchAvailableTasks,
  selectTasks,
  selectTasksErrorMessage,
  selectTasksErrorStatus,
  selectTasksFetchStatus,
  selectTasksLoadingStatus,
  selectTasksMinimumDifficultyLevel,
  selectTasksRefetchNeeded,
  setTasksMinimumDifficultyLevel,
  setTasksRefetchNeeded,
} from "../../../../store/tasksSlice";
import {
  clearTagsError,
  fetchTags,
  selectTagsErrorMessage,
  selectTagsErrorStatus,
  selectTagsFetchStatus,
  selectTagsLoadingStatus,
} from "../../../../store/tagsSlice";

import styles from "./availableTasksMain.module.scss";

import TasksLevelFilter from "../tasksLevelFilter/tasksLevelFilter";
import TagFilter from "../tagFilter/tagFilter";

export default function AvailableTasksMain() {
  const [fetchComplete, setFetchComplete] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const dispatch = useDispatch();

  // const isAuthenticated = useSelector(selectIsAuthenticated);

  const dataLoaded = useSelector(selectAvailableTasksPageLoaded);

  const tasks = useSelector(selectTasks);
  const isLoadingTasks = useSelector(selectTasksLoadingStatus);
  const isFetchCompleteTasks = useSelector(selectTasksFetchStatus);
  const needsRefetchTasks = useSelector(selectTasksRefetchNeeded);
  const hasErrorTasks = useSelector(selectTasksErrorStatus);
  const errorMessageTasks = useSelector(selectTasksErrorMessage);
  //prettier-ignore
  const minimumDifficultyLevelTasks = useSelector(selectTasksMinimumDifficultyLevel);

  const isFetchCompleteTags = useSelector(selectTagsFetchStatus);
  const isLoadingTags = useSelector(selectTagsLoadingStatus);
  const hasErrorTags = useSelector(selectTagsErrorStatus);
  const errorMessageTags = useSelector(selectTagsErrorMessage);

  //prettier-ignore
  const userInfoMinimumDifficultyLevel = useSelector(selectUserInfoMinimumDifficultyLevel);

  // if task is added to userTasks we use this state to refetch tasks excluding the added task
  const userTaskUpdated = useSelector(selectUserTaskUpdated);

  const { t } = useTranslation();

  // fetch tasks on mount
  useEffect(() => {
    if (!isFetchCompleteTasks && !isLoadingTasks && !hasErrorTasks) {
      dispatch(fetchAvailableTasks());
      dispatch(setTasksMinimumDifficultyLevel(userInfoMinimumDifficultyLevel));
    }
  }, [
    dispatch,
    isFetchCompleteTasks,
    isLoadingTasks,
    hasErrorTasks,
    userInfoMinimumDifficultyLevel,
  ]);

  useEffect(() => {
    if (!isFetchCompleteTags && !isLoadingTags && !hasErrorTags) {
      dispatch(fetchTags());
    }
  }, [dispatch, isFetchCompleteTags, isLoadingTags, hasErrorTags]);
  // if user selected new minimum difficulty level and userState was updated through refetch
  // we need to refetch tasks
  useEffect(() => {
    if (minimumDifficultyLevelTasks !== userInfoMinimumDifficultyLevel) {
      dispatch(setTasksRefetchNeeded());
    }
  }, [dispatch, minimumDifficultyLevelTasks, userInfoMinimumDifficultyLevel]);

  useEffect(() => {
    if (needsRefetchTasks) {
      dispatch(fetchAvailableTasks());
    }
  }, [dispatch, needsRefetchTasks]);

  // if task added to user tasks we need to refetch tasks
  useEffect(() => {
    if (userTaskUpdated) {
      dispatch(clearUserTaskUpdated());
      dispatch(setTasksRefetchNeeded());
    }
  }, [dispatch, userTaskUpdated]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      const filteredTasks = tasks.filter((task) =>
        selectedTags.every((tag) => task.Tags.some((t) => t.id === tag.id))
      );
      setFilteredTasks(filteredTasks);
    } else {
      const filteredTasks = tasks;
      setFilteredTasks(filteredTasks);
    }
  }, [selectedTags, tasks]);

  useEffect(() => {
    if (isFetchCompleteTasks && isFetchCompleteTags) {
      setFetchComplete(true);
      dispatch(setAvailableTasksPageLoaded());
    }
  }, [isFetchCompleteTasks, isFetchCompleteTags, setFetchComplete, dispatch]);

  return (
    <div className={styles.mainContainer}>
      {(fetchComplete || dataLoaded) && (
        <>
          <div className={styles.availableTasksHeader}>
            <h4>{t("availableTasks.title")}</h4>
            <TasksLevelFilter />
          </div>

          <TagFilter
            selectedTags={selectedTags}
            onSetSelectedTags={setSelectedTags}
          />

          {isFetchCompleteTasks && filteredTasks?.length === 0 && (
            <p>{t("common.nothingHere")}</p>
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
        </>
      )}
      {hasErrorTasks && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessageTasks}
          onCancel={clearTasksError}
        />
      )}
      {hasErrorTags && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessageTags}
          onCancel={clearTagsError}
        />
      )}
      <LoadingState fadeOut={fetchComplete} inactive={dataLoaded} />
    </div>
  );
}
