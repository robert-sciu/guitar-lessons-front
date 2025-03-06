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
  selectSelectedTags,
  selectTagsErrorMessage,
  selectTagsErrorStatus,
  selectTagsFetchStatus,
  selectTagsLoadingStatus,
  selectTagsRefetchNeeded,
} from "../../../../store/tagsSlice";

// import styles from "./availableTasksMain.module.scss";

import TasksLevelFilter from "../tasksLevelFilter/tasksLevelFilter";
import TagFilter from "../tagFilter/tagFilter";
import useReduxFetch from "../../../../hooks/useReduxFetch";

export default function AvailableTasksMain() {
  const [filteredTasks, setFilteredTasks] = useState([]);

  const dispatch = useDispatch();

  const tasks = useSelector(selectTasks);
  const isFetchCompleteTasks = useSelector(selectTasksFetchStatus);

  const selectedTags = useSelector(selectSelectedTags);
  const isFetchCompleteTags = useSelector(selectTagsFetchStatus);
  //prettier-ignore

  const minimumDifficultyLevelTasks = useSelector(selectTasksMinimumDifficultyLevel);
  const userInfoMinimumDifficultyLevel = useSelector(
    selectUserInfoMinimumDifficultyLevel
  );
  // if task is added to userTasks we use this state to refetch tasks excluding the added task
  const userTaskUpdated = useSelector(selectUserTaskUpdated);

  useReduxFetch({
    fetchAction: fetchAvailableTasks,
    fetchCompleteSelector: selectTasksFetchStatus,
    loadingSelector: selectTasksLoadingStatus,
    errorSelector: selectTasksErrorStatus,
    refetchSelector: selectTasksRefetchNeeded,
  });

  useReduxFetch({
    fetchAction: fetchTags,
    fetchCompleteSelector: selectTagsFetchStatus,
    loadingSelector: selectTagsLoadingStatus,
    errorSelector: selectTagsErrorStatus,
    refetchSelector: selectTagsRefetchNeeded,
  });

  const { t } = useTranslation();

  // if minimum difficulty level changed we need to refetch tasks
  useEffect(() => {
    if (minimumDifficultyLevelTasks !== userInfoMinimumDifficultyLevel) {
      dispatch(setTasksMinimumDifficultyLevel(userInfoMinimumDifficultyLevel));
      dispatch(setTasksRefetchNeeded());
    }
  });

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

  return (
    <DashboardContentContainer
      showContent={isFetchCompleteTags && isFetchCompleteTasks}
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
      disableLoadingState={isFetchCompleteTags && isFetchCompleteTasks}
      modals={[
        {
          showModal: useSelector(selectTasksErrorStatus),
          modalType: "error",
          onCancel: clearTasksError,
          data: useSelector(selectTasksErrorMessage),
        },
        {
          showModal: useSelector(selectTagsErrorStatus),
          modalType: "error",
          onCancel: clearTagsError,
          data: useSelector(selectTagsErrorMessage),
        },
      ]}
    />
  );
}
