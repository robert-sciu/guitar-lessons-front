import PropTypes from "prop-types";

import styles from "./errorWindow.module.scss";
import { useTranslation } from "react-i18next";

export default function ErrorWindow({ error, onCancel, dispatch }) {
  const { t } = useTranslation();
  return (
    <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
      <p>{error}</p>
      <button onClick={() => dispatch(onCancel())}>{t("buttons.close")}</button>
    </div>
  );
}

ErrorWindow.propTypes = {
  error: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
