import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  addUserTask,
  deleteUserTask,
  updateUserTaskNotes,
} from "../../../store/userTasksSlice";
import TagDisplay from "../../tagDisplay/tagDisplay";
import { debounce } from "lodash";
import styles from "./taskDisplayMain.module.scss";
import i18n from "../../../../config/i18n";
import { downloadTaskFile } from "../../../store/tasksSlice";
import TaskDisplayMoreInfo from "../taskDisplayMoreInfo/taskDisplayMoreInfo";
import YouTubeLink from "../youTubeLink/youTubeLink";
import TaskDisplayButtons from "../taskDisplayButtons/taskDisplayButtons";
import ConfirmationWindow from "../../modalWindows/confirmationWindow/confirmationWindow";

export default function TaskDisplayMain({ task, ...props }) {
  const language = i18n.language;
  const {
    enableDelete = false,
    enableAdd = false,
    enableShowMore = false,
    showTags = false,
  } = props;
  const [notes, setNotes] = useState(
    task?.user_task?.user_notes ? task.user_task.user_notes : ""
  );
  const [addingTask, setAddingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [isWritingNotes, setIsWritingNotes] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const tags = showTags ? task.Tags : null;

  const dispatch = useDispatch();

  const debouncedSaveNote = useRef(
    debounce((note) => {
      setIsWritingNotes(false);
      dispatch(updateUserTaskNotes({ task_id: task.id, user_notes: note }));
    }, 1000)
  ).current;

  useEffect(() => {
    if (!deleteConfirmed) return;
    dispatch(deleteUserTask(taskIdToDelete));
    setDeleteConfirmed(false);
    setDeletingTask(false);
    setTaskIdToDelete(null);
  }, [deleteConfirmed, taskIdToDelete, dispatch]);

  function handleAddTask(e) {
    e.preventDefault();
    setAddingTask(true);
    dispatch(addUserTask({ task_id: task.id }));
  }

  function handleDeleteTask(e) {
    e.preventDefault();
    setDeletingTask(true);
    setTaskIdToDelete(task.id);
    // dispatch(deleteUserTask(task.id));
  }

  function handleInputChange(e) {
    setIsWritingNotes(true);
    setNotes(e.target.value);
    debouncedSaveNote(e.target.value);
  }

  function handleDownload(e) {
    e.preventDefault();
    dispatch(downloadTaskFile({ filename: task.filename }));
  }

  return (
    <div className={styles.taskDisplayContainer}>
      <div className={styles.title}>
        {task.youtube_url && <YouTubeLink url={task.youtube_url} />}
        <div className={styles.titleText}>
          <h5>{task.title}</h5>
          <p>({task.artist})</p>
        </div>
      </div>

      <div className={styles.tagsContainer}>
        {tags?.map((tag) => (
          <TagDisplay key={tag.id} tag={tag} clickable={false} />
        ))}
      </div>

      <div className={styles.taskDifficulty}>
        <p>
          {t("taskDisplay.difficultyLevel")}: {task.difficulty_level}
        </p>
      </div>

      <TaskDisplayButtons
        enableAdd={enableAdd}
        enableShowMore={enableShowMore}
        enableDelete={enableDelete}
        handleAddTask={handleAddTask}
        handleDeleteTask={handleDeleteTask}
        addingTask={addingTask}
        deletingTask={deletingTask}
        showMore={showMore}
        setShowMore={setShowMore}
      />

      {showMore && (
        <TaskDisplayMoreInfo
          task={task}
          notes={notes}
          isWritingNotes={isWritingNotes}
          handleInputChange={handleInputChange}
          handleDownload={handleDownload}
          language={language}
        />
      )}
      {taskIdToDelete && (
        <ConfirmationWindow
          confirmationInfoHTML={t("taskDisplay.confirmDelete")}
          confirmHandler={() => {
            setDeleteConfirmed(true);
          }}
          dismissHandler={() => {
            setDeleteConfirmed(false);
            setDeletingTask(false);
            setTaskIdToDelete(null);
          }}
          dataForHandler={taskIdToDelete}
        />
      )}
    </div>
  );
}

TaskDisplayMain.propTypes = {
  task: PropTypes.object,
  enableDelete: PropTypes.bool,
  enableAdd: PropTypes.bool,
  showTags: PropTypes.bool,
  showUserNotes: PropTypes.bool,
  enableShowMore: PropTypes.bool,
  completed: PropTypes.bool,
};
