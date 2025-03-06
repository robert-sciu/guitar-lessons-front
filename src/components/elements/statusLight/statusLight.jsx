import styles from "./statusLight.module.scss";
import PropTypes from "prop-types";
export default function StatusLight({ isActive }) {
  return (
    <div
      className={
        isActive
          ? styles.activationStatusLightActive
          : styles.activationStatusLightNotActive
      }
    ></div>
  );
}

StatusLight.propTypes = {
  isActive: PropTypes.bool,
};
