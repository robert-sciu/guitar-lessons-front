import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableTasks,
  selectAvailableTasks,
  selectIsLoadingTasks,
} from "../../../../store/tasksSlice";
import { selectIsAuthenticated } from "../../../../store/authSlice";
import TaskDisplay from "../../../../components/taskDisplay/taskDisplay";
import { selectFetchComplete } from "../../../../store/tasksSlice";
import {
  fetchTags,
  selectFetchTagsComplete,
  selectTags,
} from "../../../../store/tagsSlice";
import TagDisplay from "../../../../components/tagDisplay/tagDisplay";

import styles from "./availableTasksMain.module.scss";

export default function AvailableTasksMain() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const allAvailableTasks = useSelector(selectAvailableTasks);
  const allTags = useSelector(selectTags);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoadingTasks);
  const fetchComplete = useSelector(selectFetchComplete);
  const fetchTagsComplete = useSelector(selectFetchTagsComplete);

  const dispatch = useDispatch();

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
    if (isAuthenticated && !fetchComplete) {
      dispatch(fetchAvailableTasks());
    }
  }, [dispatch, isAuthenticated, fetchComplete]);

  useEffect(() => {
    if (isAuthenticated && !fetchTagsComplete) {
      dispatch(fetchTags());
    }
  }, [dispatch, isAuthenticated, fetchTagsComplete]);

  function handleTagClick(tag, selected) {
    if (selected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }
  return (
    <div className={styles.tasksContainer}>
      <div className={styles.selectedTags}>
        <p>selected tags:</p>
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
      <h1></h1>
      {isLoading && <p>Loading...</p>}
      {fetchComplete && allAvailableTasks?.length === 0 && <p>No tasks yet</p>}
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
