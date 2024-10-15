import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import styles from "./errorWindow.module.scss";
import { useTranslation } from "react-i18next";

export default function ErrorWindow({ error, dismissHandler }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <div className={styles.errorWindowContainer}>
      <div className={styles.errorWindow}>
        <p style={{ color: "black" }}>{error}</p>
        <button
          onClick={() => {
            dispatch(dismissHandler());
          }}
        >
          {t("buttons.close")}
        </button>
      </div>
    </div>
  );
}

ErrorWindow.propTypes = {
  error: PropTypes.string.isRequired,
  dismissHandler: PropTypes.func.isRequired,
};
