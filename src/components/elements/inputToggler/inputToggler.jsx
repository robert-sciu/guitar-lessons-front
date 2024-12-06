import styles from "./inputToggler.module.scss";

import PropTypes from "prop-types";
import InputElement from "../inputElement/inputElement";

export default function InputToggler({ onChange, value, inputIsActive }) {
  return (
    <div className={styles.inputToggler}>
      {inputIsActive ? (
        <InputElement
          type="text"
          value={value}
          onChange={onChange}
          width={80}
        />
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
}

InputToggler.propTypes = {
  style: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputIsActive: PropTypes.bool.isRequired,
};
