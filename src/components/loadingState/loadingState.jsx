import { LiaSpinnerSolid } from "react-icons/lia";
import styles from "./loadingState.module.scss";

import PropTypes from "prop-types";
import { classNameFormatter } from "../../utilities/utilities";
import { useEffect, useState } from "react";

/**
 * A loading state component.
 *
 * @param {boolean} [fullscreen=false] - Fullscreen, sets the spinner to full screen, false by default restricts to a relative container.
 * @param {boolean} [spinnerOnly=false] - Spinner only for use inside small components like buttons.
 * @param {string} [size=undefined] - Size of the spinner, options are "sizeS" "sizeM" "sizeL" "sizeXL".
 * @param {boolean} [fadeOut=false] - Fades out the loading state and sets the display to none.
 * @param {boolean} [inactive=false] - Doesn't show the loading state at all. Use if user already visited page and data is fetched
 * @note dont use fullscreen and spinnerOnly together
 *
 * @return {ReactElement}
 */
export default function LoadingState({
  fullscreen = false,
  spinnerOnly = false,
  size = undefined,
  fadeOut = false,
  inactive = false,
}) {
  const [displayNone, setDisplayNone] = useState(false);

  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        setDisplayNone(true);
      }, 400);
    }
  });
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: [
          "defaultVisibility",
          fullscreen && "fullscreen",
          spinnerOnly && "spinnerOnly",
          !spinnerOnly && "loadingStateContainer",
          !fullscreen && !spinnerOnly && "containerSize",
          size && `size${size}`,
          fadeOut && "fadeOut",
          displayNone && "displayNone",
          inactive && !fadeOut && "displayNone",
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
  fadeOut: PropTypes.bool,
  inactive: PropTypes.bool,
};
