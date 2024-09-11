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

export default function TaskDisplay({ task, ...props }) {
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
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      {tags?.map((tag) => (
        <TagDisplay key={tag.id} tag={tag} />
      ))}
      <h3>{task.title}</h3>
      <p>{task.artist}</p>
      <p>
        {t("taskDisplay.difficultyLevel")}: {task.difficulty_level}
      </p>
      {showMore && (
        <div>
          <p>{task.notes_pl}</p>
          <p>{task.notes_en}</p>
          <p>{task.url}</p>
        </div>
      )}
      {showUserNotes && (
        <div>
          <p>
            {t("taskDisplay.userNotes")}:{isWritingNotes ? "typing" : ""}
          </p>
          <textarea value={notes} onChange={handleInputChange} />
        </div>
      )}
      <button onClick={() => setShowMore(!showMore)}>
        {t("taskDisplay.showMore")}
      </button>
      {enableAdd && (
        <button onClick={handleAddTask}>
          {loading ? "Loading..." : t("taskDisplay.addTask")}
        </button>
      )}
      {enableDelete && (
        <button onClick={handleDeleteTask}>
          {loading ? "Deleting..." : t("taskDisplay.deleteTask")}
        </button>
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
