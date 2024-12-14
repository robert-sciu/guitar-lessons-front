import Button from "../../elements/button/button";

import styles from "./infoModal.module.scss";

import PropTypes from "prop-types";

export default function InfoModal({ info, onConfirm }) {
  return (
    <div className={styles.modalWindow}>
      <div>{info}</div>
      <div className={styles.buttonsContainer}>
        <Button label={"Ok"} onClick={onConfirm} />
      </div>
    </div>
  );
}

InfoModal.propTypes = {
  info: PropTypes.string,
  onConfirm: PropTypes.func,
};
