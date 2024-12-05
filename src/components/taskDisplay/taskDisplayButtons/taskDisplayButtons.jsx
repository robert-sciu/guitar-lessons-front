import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../elements/button/button";

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
  const [deleting, setDeleting] = useState(false);
  function deleteTaskHandler(e) {
    if (!deletingTask) {
      setDeleting(true);
      handleDeleteTask(e);
    }
  }

  function addTasksHandler(e) {
    if (!addingTask) {
      handleAddTask(e);
    }
  }
  const { t } = useTranslation();
  return (
    <div className={styles.buttonsContainer}>
      {enableAdd && (
        <Button
          label={t("taskDisplay.addTask")}
          onClick={addTasksHandler}
          isLoading={addingTask}
          loadingLabel={t("taskDisplay.addingTask")}
          style={"greenBtn"}
        />
      )}
      {enableShowMore && (
        <Button
          label={t("taskDisplay.showMore")}
          isActive={showMore}
          activeLabel={t("taskDisplay.showLess")}
          onClick={() => setShowMore(!showMore)}
        />
      )}
      {enableDelete && (
        <Button
          label={t("taskDisplay.deleteTask")}
          onClick={deleteTaskHandler}
          isLoading={deleting && deletingTask}
          loadingLabel={t("taskDisplay.deletingTask")}
        />
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
