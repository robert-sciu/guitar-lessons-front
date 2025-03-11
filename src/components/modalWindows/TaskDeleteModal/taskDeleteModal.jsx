import { useTranslation } from "react-i18next";
import styles from "./taskDeleteModal.module.scss";
import PropTypes from "prop-types";
import Button from "../../elements/button/button";
import { useSelector } from "react-redux";
import { selectAdminUserSelectedUserId } from "../../../store/admin/adminUserInfoSlice";

export default function TaskDeleteModal({
  onSubmit,
  onCancel,
  taskId,
  dispatch,
}) {
  const adminSelectedUserId = useSelector(selectAdminUserSelectedUserId);
  const { t } = useTranslation();
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      if (adminSelectedUserId) {
        dispatch(onSubmit({ userId: adminSelectedUserId, taskId }));
      } else {
        dispatch(onSubmit(taskId));
      }
    } else {
      dispatch(onCancel());
    }
  }
  return (
    <div className={styles.modalWindow}>
      <div>{t("taskDisplay.confirmDelete")}</div>
      <div className={styles.buttonsContainer}>
        <Button
          label={t("buttons.confirm")}
          onClick={() => handleClick(true)}
        />
        <Button
          label={t("buttons.cancel")}
          onClick={() => handleClick(false)}
        />
      </div>
    </div>
  );
}

TaskDeleteModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  taskId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};
