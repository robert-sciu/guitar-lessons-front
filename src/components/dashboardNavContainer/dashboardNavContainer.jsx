import { Outlet } from "react-router-dom";
import { classNameFormatter } from "../../utilities/utilities";
import styles from "./dashboardNavContainer.module.scss";

import PropTypes from "prop-types";

export default function DashboardNavContainer({
  dashboardWelcome,
  navLinks,
  fetchComplete,
}) {
  return (
    <div className={styles.dashboardContainer}>
      <div
        className={classNameFormatter({
          styles,
          classNames: ["dashboardNav", fetchComplete ? "show" : "hide"],
        })}
      >
        {fetchComplete && dashboardWelcome}
        {navLinks}
      </div>
      <div className={styles.dashboardContentContainer}>
        {fetchComplete && <Outlet />}
      </div>
    </div>
  );
}

DashboardNavContainer.propTypes = {
  dashboardWelcome: PropTypes.node,
  navLinks: PropTypes.node,
  fetchComplete: PropTypes.bool,
};
