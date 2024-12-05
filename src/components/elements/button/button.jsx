import { classNameFormatter } from "../../../utilities/utilities";
import LoadingState from "../../loadingState/loadingState";
import styles from "./button.module.scss";
import PropTypes from "prop-types";

/**
 * A button component.
 *
 * @param {string} label - The label for the button.
 * @param {boolean} isActive - Whether the button is active.
 * @param {string} activeLabel - The label for the button when it is active.
 * @param {ReactElement} icon - The icon for the button.
 * @param {function} onClick - The function to call when the button is clicked.
 * @param {boolean} isLoading - Whether the button is in a loading state.
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {string} loadingLabel - The label for the button when it is loading.
 * @param {string} style - A class name to add to the button. Available styles are "greenBtn", "smallBtn".
 *
 * @return {ReactElement}
 */
export default function Button({
  label,
  isActive,
  activeLabel,
  icon,
  onClick,
  isLoading,
  disabled,
  loadingLabel,
  style,
}) {
  return (
    <button
      className={classNameFormatter({
        styles,
        classNames: ["button", style, disabled && "disabled"],
      })}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <>
          <LoadingState spinnerOnly={true} />
          <p>{loadingLabel}</p>
        </>
      )}
      {!isLoading && (
        <>
          {icon}
          <p>{isActive ? activeLabel : label}</p>
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  isActive: PropTypes.bool,
  icon: PropTypes.element,
  label: PropTypes.string,
  activeLabel: PropTypes.string,
  loadingLabel: PropTypes.string,
  style: PropTypes.string,
  disabled: PropTypes.bool,
};
