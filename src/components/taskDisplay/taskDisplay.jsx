import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserTask,
  deleteUserTask,
  selectIsLoadingUserTasks,
  updateUserTaskNotes,
} from "../../store/userTasksSlice";
import TagDisplay from "../tagDisplay/tagDisplay";
import { debounce } from "lodash";
import styles from "./taskDisplay.module.scss";
import i18n from "../../../config/i18n";
import { IoLogoYoutube } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function TaskDisplay({ task, ...props }) {
  const language = i18n.language;
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(
    task?.UserTask?.user_notes ? task.UserTask.user_notes : ""
  );
  const [isWritingNotes, setIsWritingNotes] = useState(false);
  const {
    enableDelete = false,
    enableAdd = false,
    showTags = false,
    showUserNotes = false,
  } = props;
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const tags = showTags ? task.Tags : null;
  const isLoading = useSelector(selectIsLoadingUserTasks);
  const dispatch = useDispatch();

  console.log(task);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const debouncedSaveNote = useRef(
    debounce((note) => {
      setIsWritingNotes(false);
      if (task?.UserTask?.id) {
        dispatch(
          updateUserTaskNotes({ id: task.UserTask.id, user_notes: note })
        );
      }
    }, 1000)
  ).current;

  function handleAddTask(e) {
    e.preventDefault();
    setLoading(true);
    const userTask = {
      task_id: task.id,
    };
    dispatch(addUserTask(userTask));
  }

  function handleDeleteTask(e) {
    e.preventDefault();
    setLoading(true);
    dispatch(deleteUserTask(task.UserTask.id));
  }

  function handleInputChange(e) {
    setIsWritingNotes(true);
    setNotes(e.target.value);
    debouncedSaveNote(e.target.value);
  }
  return (
    <div className={styles.taskDisplayContainer}>
      <div className={styles.title}>
        {task.youtube_url && (
          <Link
            to={`https://${task.youtube_url}`}
            target="_blank"
            className={styles.icon}
          >
            <IoLogoYoutube />
          </Link>
        )}
        <div className={styles.titleText}>
          <h5>{task.title}</h5>
          <p>{task.artist}</p>
        </div>
      </div>

      <div className={styles.tagsContainer}>
        {tags?.map((tag) => (
          <TagDisplay key={tag.id} tag={tag} />
        ))}
      </div>

      <div className={styles.taskDifficulty}>
        <p>
          {t("taskDisplay.difficultyLevel")}: {task.difficulty_level}
        </p>
      </div>
      {showUserNotes && (
        <div>
          <p>
            {t("taskDisplay.userNotes")}:{isWritingNotes ? "typing" : ""}
          </p>
          <textarea value={notes} onChange={handleInputChange} />
        </div>
      )}

      <div className={styles.buttonsContainer}>
        {enableAdd && (
          <button onClick={handleAddTask} className={styles.addTask}>
            {loading ? "Loading..." : t("taskDisplay.addTask")}
          </button>
        )}
        <button onClick={() => setShowMore(!showMore)}>
          {t("taskDisplay.showMore")}
        </button>
        {enableDelete && (
          <button onClick={handleDeleteTask}>
            {loading ? "Deleting..." : t("taskDisplay.deleteTask")}
          </button>
        )}
      </div>
      {showMore && (
        <div className={styles.moreInfo}>
          <p>
            {t("taskDisplay.description")}: {task[`notes_${language}`]}
          </p>
          <p>
            {t("taskDisplay.tutorial")}:{" "}
            <Link to={`https://${task.url}`} target="_blank">
              {task.url}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

TaskDisplay.propTypes = {
  task: PropTypes.object,
  enableDelete: PropTypes.bool,
  enableAdd: PropTypes.bool,
  showTags: PropTypes.bool,
  showUserNotes: PropTypes.bool,
};
