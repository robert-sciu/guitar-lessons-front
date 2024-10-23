import { Link } from "react-router-dom";
import styles from "./taskDisplayMoreInfo.module.scss";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
export default function TaskDisplayMoreInfo({
  task,
  notes,
  isWritingNotes,
  handleInputChange,
  handleDownload,
  language,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.moreInfo}>
      <div className={styles.userNotesContainer}>
        <h6>
          {t("taskDisplay.userNotes")}:
          {isWritingNotes ? ` ${t("taskDisplay.isTyping")}` : ""}
        </h6>
        <textarea value={notes} onChange={handleInputChange} />
      </div>
      <div className={styles.additionalNotesContainer}>
        <h6>{t("taskDisplay.description")}:</h6>
        <p>{task[`notes_${language}`]}</p>
        <h6>{t("taskDisplay.tutorial")}: </h6>
        <Link to={`https://${task.url}`} target="_blank">
          {task.url}
        </Link>
        {task.filename && (
          <div>
            <h6>{t("taskDisplay.file")}:</h6>
            <div className={styles.fileContainer}>
              {task.filename}
              <button onClick={handleDownload}>{t("buttons.download")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

TaskDisplayMoreInfo.propTypes = {
  task: PropTypes.object.isRequired,
  notes: PropTypes.string.isRequired,
  isWritingNotes: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
