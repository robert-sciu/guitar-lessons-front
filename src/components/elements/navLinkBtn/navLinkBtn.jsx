import { NavLink } from "react-router-dom";

import styles from "./navLinkBtn.module.scss";

import PropTypes from "prop-types";
import { classNameFormatter } from "../../../utilities/utilities";

export default function NavLinkBtn({ to, label, icon, onClick = () => {} }) {
  function activeStateStyleHandler({ isActive }) {
    return classNameFormatter({
      styles,
      classNames: ["navLink", isActive && "active"],
    });
  }
  return (
    <li>
      <NavLink className={activeStateStyleHandler} to={to} onClick={onClick}>
        {label}
        <div className={styles.icon}>{icon}</div>
      </NavLink>
    </li>
  );
}

NavLinkBtn.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func,
};
