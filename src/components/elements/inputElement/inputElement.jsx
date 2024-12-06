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
export default function InputElement({ type, value, onChange, width }) {
  return (
    <input
      className={classNameFormatter({
        styles,
        classNames: ["inputElement", width && `width-${width}`],
      })}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}

InputElement.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  width: PropTypes.any,
};
