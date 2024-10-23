import { useTranslation } from "react-i18next";
import styles from "./confirmationWindow.module.scss";
import PropTypes from "prop-types";

export default function ConfirmationWindow({
  confirmationInfoHTML,
  confirmHandler,
  dataForHandler,
  dismissHandler,
  dispatch,
}) {
  const { t } = useTranslation();
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(confirmHandler(dataForHandler));
    } else {
      dispatch(dismissHandler());
    }
  }
  return (
    <div className={styles.confirmationWindowBackground}>
      <div className={styles.confirmationWindow}>
        <div>{confirmationInfoHTML}</div>
        <div className={styles.buttonsContainer}>
          <button onClick={() => handleClick(true)}>
            {t("buttons.confirm")}
          </button>
          <button onClick={() => handleClick(false)}>
            {t("buttons.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationWindow.propTypes = {
  confirmationInfoHTML: PropTypes.node.isRequired,
  confirmHandler: PropTypes.func.isRequired,
  dismissHandler: PropTypes.func.isRequired,
  dataForHandler: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
