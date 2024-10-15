import { useTranslation } from "react-i18next";
import styles from "./codeRequiredModal.module.scss";

import PropTypes from "prop-types";

export default function CodeRequiredModal({
  onInput,
  onSubmit,
  onCancel,
  showModal,
  isLoading,
  message,
}) {
  const { t } = useTranslation();
  return (
    showModal && (
      <div className={styles.codeRequiredModalBg}>
        {isLoading ? (
          "Loading..."
        ) : (
          <div className={styles.codeRequiredModalContainer}>
            <h4>{t("modals.codeRequired")}</h4>
            <p>{message}</p>
            <input
              type="text"
              onChange={onInput}
              placeholder={t("modals.codePlaceholder")}
            />
            <div className={styles.buttonsContainer}>
              <button onClick={onSubmit}>{t("buttons.confirm")}</button>
              <button onClick={onCancel}>{t("buttons.cancel")}</button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

CodeRequiredModal.propTypes = {
  onInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};
