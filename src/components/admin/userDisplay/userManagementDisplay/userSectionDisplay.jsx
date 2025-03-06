import { classNameFormatter } from "../../../../utilities/utilities";
import styles from "./userSectionDisplay.module.scss";

import PropTypes from "prop-types";

export default function UserSectionDisplay({ columns, children }) {
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: ["mainContainer", `columns-${columns}`],
      })}
    >
      {children}
    </div>
  );
}

UserSectionDisplay.propTypes = {
  columns: PropTypes.number,
  children: PropTypes.node,
};
