import { useTranslation } from "react-i18next";
import styles from "./codeRequiredModal.module.scss";

import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfoLoadingStatus } from "../../../store/userInfoSlice";
import Button from "../../elements/button/button";

export default function CodeRequiredModal({ onSubmit, onCancel, dispatch }) {
  const { t } = useTranslation();
  const [confirmationCode, setConfirmationCode] = useState("");
  const isLoading = useSelector(selectUserInfoLoadingStatus);
  function handleSubmit() {
    dispatch(onSubmit({ change_email_token: confirmationCode }));
  }
  function handleCancel() {
    dispatch(onCancel());
  }
  return (
    <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
      <h4>{t("modals.codeRequired")}</h4>
      <input
        type="text"
        onChange={(e) => setConfirmationCode(e.target.value)}
        placeholder={t("modals.codePlaceholder")}
      />
      <div className={styles.buttonsContainer}>
        <Button
          label={t("buttons.confirm")}
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingLabel={t("buttons.wait")}
        />
        <Button label={t("buttons.cancel")} onClick={handleCancel} />
      </div>
    </div>
  );
}

CodeRequiredModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
