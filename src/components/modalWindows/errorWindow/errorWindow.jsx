import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import styles from "./errorWindow.module.scss";
import { useTranslation } from "react-i18next";

export default function ErrorWindow({ error, dismissHandler, showError }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    showError && (
      <div
        className={styles.errorWindowContainer}
        onClick={() => dispatch(dismissHandler())}
      >
        <div
          className={styles.errorWindow}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ color: "black" }}>{error}</p>
          <button onClick={() => dispatch(dismissHandler())}>
            {t("buttons.close")}
          </button>
        </div>
      </div>
    )
  );
}

ErrorWindow.propTypes = {
  error: PropTypes.string,
  dismissHandler: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
};
