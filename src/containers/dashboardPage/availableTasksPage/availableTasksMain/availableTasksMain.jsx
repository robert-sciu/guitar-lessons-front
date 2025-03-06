import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import TaskDisplay from "../../../../components/taskDisplay/taskDisplayMain/taskDisplayMain";
import DashboardContentContainer from "../../../dashboardContentContainer/DashboardContentContainer";

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
  setTasksMinimumDifficultyLevel,
} from "../../../../store/tasksSlice";
import {
  clearTagsError,
  fetchTags,
  selectSelectedTags,
  selectTagsErrorMessage,
  selectTagsErrorStatus,
  selectTagsFetchStatus,
  selectTagsLoadingStatus,
} from "../../../../store/tagsSlice";

// import styles from "./availableTasksMain.module.scss";

import TasksLevelFilter from "../tasksLevelFilter/tasksLevelFilter";
import TagFilter from "../tagFilter/tagFilter";

export default function AvailableTasksMain() {
  const [fetchComplete, setFetchComplete] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const dispatch = useDispatch();

  const dataLoaded = useSelector(selectAvailableTasksPageLoaded);

  const tasks = useSelector(selectTasks);
  const isLoadingTasks = useSelector(selectTasksLoadingStatus);
  const isFetchCompleteTasks = useSelector(selectTasksFetchStatus);
  const hasErrorTasks = useSelector(selectTasksErrorStatus);
  const errorMessageTasks = useSelector(selectTasksErrorMessage);
  //prettier-ignore
  const minimumDifficultyLevelTasks = useSelector(selectTasksMinimumDifficultyLevel);

  const isFetchCompleteTags = useSelector(selectTagsFetchStatus);
  const selectedTags = useSelector(selectSelectedTags);
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
  // fetch tags on mount
  useEffect(() => {
    if (!isFetchCompleteTags && !isLoadingTags && !hasErrorTags) {
      dispatch(fetchTags());
    }
  }, [dispatch, isFetchCompleteTags, isLoadingTags, hasErrorTags]);

  // if minimum difficulty level changed we need to refetch tasks
  useEffect(() => {
    if (minimumDifficultyLevelTasks !== userInfoMinimumDifficultyLevel) {
      dispatch(setTasksMinimumDifficultyLevel(userInfoMinimumDifficultyLevel));
      dispatch(fetchAvailableTasks());
    }
  });

  // if task added to user tasks we need to refetch tasks
  useEffect(() => {
    if (userTaskUpdated) {
      dispatch(clearUserTaskUpdated());
      dispatch(fetchAvailableTasks());
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
    <DashboardContentContainer
      showContent={fetchComplete || dataLoaded}
      contentHeader={t("availableTasks.title")}
      contentSubHeader={filteredTasks?.length === 0 && t("common.nothingHere")}
      contentFilter={<TasksLevelFilter />}
      tagFilter={<TagFilter />}
      contentCol={filteredTasks?.map((task) => (
        <TaskDisplay
          key={task.id}
          task={task}
          enableAdd={true}
          showTags={true}
        />
      ))}
      disableLoadingState={dataLoaded}
      modals={[
        {
          showModal: hasErrorTasks,
          modalType: "error",
          onCancel: clearTasksError,
          data: errorMessageTasks,
        },
        {
          showModal: hasErrorTags,
          modalType: "error",
          onCancel: clearTagsError,
          data: errorMessageTags,
        },
      ]}
    />
  );
}
