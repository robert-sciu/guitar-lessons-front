import { useTranslation } from "react-i18next";
import LoadingState from "../../loadingState/loadingState";
import styles from "./taskDisplayButtons.module.scss";

import PropTypes from "prop-types";
export default function TaskDisplayButtons({
  enableAdd,
  enableShowMore,
  enableDelete,

  handleAddTask,
  handleDeleteTask,

  addingTask,
  deletingTask,

  showMore,
  setShowMore,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.buttonsContainer}>
      {enableAdd && (
        <button
          className={`${styles.taskButton} ${styles.addTaskButton}`}
          onClick={handleAddTask}
        >
          {addingTask ? (
            <>
              <LoadingState spinnerOnly={true} /> {t("taskDisplay.addingTask")}
            </>
          ) : (
            t("taskDisplay.addTask")
          )}
        </button>
      )}
      {enableShowMore && (
        <button
          className={styles.taskButton}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? t("taskDisplay.showLess") : t("taskDisplay.showMore")}{" "}
        </button>
      )}
      {enableDelete && (
        <button className={styles.taskButton} onClick={handleDeleteTask}>
          {deletingTask ? (
            <>
              <LoadingState spinnerOnly={true} />{" "}
              {t("taskDisplay.deletingTask")}
            </>
          ) : (
            t("taskDisplay.deleteTask")
          )}
        </button>
      )}
    </div>
  );
}

TaskDisplayButtons.propTypes = {
  enableAdd: PropTypes.bool,
  enableShowMore: PropTypes.bool,
  enableDelete: PropTypes.bool,
  handleAddTask: PropTypes.func,
  handleDeleteTask: PropTypes.func,
  addingTask: PropTypes.bool,
  deletingTask: PropTypes.bool,
  showMore: PropTypes.bool,
  setShowMore: PropTypes.func,
};
