import { LiaSpinnerSolid } from "react-icons/lia";
import styles from "./loadingState.module.scss";

import PropTypes from "prop-types";
import { classNameFormatter } from "../../utilities/utilities";

/**
 * A loading state component.
 *
 * @param {boolean} [fullscreen=false] - Fullscreen, sets the spinner to full screen, false by default restricts to a relative container.
 * @param {boolean} [spinnerOnly=false] - Spinner only for use inside small components like buttons.
 * @note dont use fullscreen and spinnerOnly together
 *
 * @return {ReactElement}
 */
export default function LoadingState({
  fullscreen = false,
  spinnerOnly = false,
  size = undefined,
}) {
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: [
          fullscreen && "fullscreen",
          spinnerOnly && "spinnerOnly",
          !spinnerOnly && "loadingStateContainer",
          !fullscreen && !spinnerOnly && "containerSize",
          size && `size${size}`,
        ],
      })}
    >
      <div
        className={classNameFormatter({
          styles,
          classNames: [!spinnerOnly && "spinner"],
        })}
      >
        <LiaSpinnerSolid />
      </div>
    </div>
  );
}

LoadingState.propTypes = {
  fullscreen: PropTypes.bool,
  spinnerOnly: PropTypes.bool,
  size: PropTypes.string,
};
