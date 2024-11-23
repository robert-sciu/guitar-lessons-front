import { useTranslation } from "react-i18next";
import styles from "./taskDeleteModal.module.scss";
import PropTypes from "prop-types";

export default function TaskDeleteModal({
  onSubmit,
  onCancel,
  taskId,
  dispatch,
}) {
  const { t } = useTranslation();
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(onSubmit(taskId));
    } else {
      dispatch(onCancel());
    }
  }
  return (
    <div className={styles.modalWindow}>
      <div>{t("taskDisplay.confirmDelete")}</div>
      <div className={styles.buttonsContainer}>
        <button onClick={() => handleClick(true)}>
          {t("buttons.confirm")}
        </button>
        <button onClick={() => handleClick(false)}>
          {t("buttons.cancel")}
        </button>
      </div>
    </div>
  );
}

TaskDeleteModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
