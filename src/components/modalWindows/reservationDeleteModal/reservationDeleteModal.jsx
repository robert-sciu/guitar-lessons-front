import Button from "../../elements/button/button";
import styles from "./reservationDeleteModal.module.scss";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

export default function ReservationDeleteModal({
  data,
  onDeleteSubmit,
  onCancel,
  dispatch,
}) {
  const { t } = useTranslation();
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(onDeleteSubmit(data.id));
    } else {
      dispatch(onCancel());
    }
  }

  return (
    <div className={styles.modalWindow}>
      <div>{t("calendar.confirmCancel")}</div>
      <div className={styles.buttonsContainer}>
        <Button
          label={t("buttons.confirm")}
          style={"redBtn"}
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

ReservationDeleteModal.propTypes = {
  data: PropTypes.object,
  onDeleteSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  dispatch: PropTypes.func,
};
