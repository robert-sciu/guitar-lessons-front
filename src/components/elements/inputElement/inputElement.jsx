import { classNameFormatter } from "../../../utilities/utilities";
import styles from "./inputElement.module.scss";

import PropTypes from "prop-types";

/**
 * A customizable input element.
 *
 * @param {string} type - The type of the input element (e.g., "text", "number").
 * @param {any} value - The value of the input element.
 * @param {function} onChange - Callback function to handle changes to the input value.
 * @param {any} width - Optional width for the input element, Use numbers from 10 to 100, increment of 10
 *  or letters: S, M, L
 *
 * @return {ReactElement} - The rendered input element.
 */
export default function InputElement({
  type,
  value,
  label = false,
  inputError = false,
  onChange,
  width,
  name = "",
  autoComplete = "off",
}) {
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: ["inputElementContainer", width && `width-${width}`],
      })}
    >
      {label && <label className={styles.label}>{label}:</label>}
      <input
        className={styles.inputElement}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
      {inputError && <p className={styles.inputError}>{inputError}</p>}
    </div>
  );
}

InputElement.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  width: PropTypes.any,
  inputError: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
};
