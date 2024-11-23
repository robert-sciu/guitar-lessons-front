import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserTask,
  clearTaskToDeleteId,
  deleteUserTask,
  selectTaskToDeleteId,
  selectUserTasksIsLoading,
  updateUserTaskNotes,
} from "../../../store/userTasksSlice";
import TagDisplay from "../../tagDisplay/tagDisplay";
import { debounce } from "lodash";
import styles from "./taskDisplayMain.module.scss";
import i18n from "../../../../config/i18n";
import { downloadTaskFile } from "../../../store/tasksSlice";
import { setTaskToDeleteId } from "../../../store/userTasksSlice";
import TaskDisplayMoreInfo from "../taskDisplayMoreInfo/taskDisplayMoreInfo";
import YouTubeLink from "../youTubeLink/youTubeLink";
import TaskDisplayButtons from "../taskDisplayButtons/taskDisplayButtons";
import ModalWindowMain from "../../modalWindows/modalWindow/modalWindowMain";

export default function TaskDisplayMain({ task, ...props }) {
  const language = i18n.language;
  const {
    enableDelete = false,
    enableAdd = false,
    enableShowMore = false,
    showTags = false,
  } = props;
  //prettier-ignore
  const [notes, setNotes] = useState(task?.user_task?.user_notes ? task.user_task.user_notes : "");
  const [addingTask, setAddingTask] = useState(false);
  const [isWritingNotes, setIsWritingNotes] = useState(false);
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const tags = showTags ? task.Tags : null;
  const taskToDeleteId = useSelector(selectTaskToDeleteId);
  const dataIsLoading = useSelector(selectUserTasksIsLoading);
  const dispatch = useDispatch();

  const debouncedSaveNote = useRef(
    debounce((note) => {
      setIsWritingNotes(false);
      dispatch(updateUserTaskNotes({ task_id: task.id, user_notes: note }));
    }, 1000)
  ).current;

  function handleAddTask(e) {
    e.preventDefault();
    setAddingTask(true);
    dispatch(addUserTask({ task_id: task.id }));
  }

  function handleDeleteTask(e) {
    e.preventDefault();
    dispatch(setTaskToDeleteId(task.id));
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
        deletingTask={taskToDeleteId || dataIsLoading ? true : false}
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
      {taskToDeleteId && (
        <ModalWindowMain
          modalType={"taskDelete"}
          onSubmit={deleteUserTask}
          onCancel={clearTaskToDeleteId}
          data={taskToDeleteId}
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
