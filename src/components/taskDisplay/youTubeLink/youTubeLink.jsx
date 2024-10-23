import { IoLogoYoutube } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./youTubeLink.module.scss";
import PropTypes from "prop-types";

export default function YouTubeLink({ url }) {
  return (
    <Link to={`https://${url}`} target="_blank" className={styles.icon}>
      <IoLogoYoutube />
    </Link>
  );
}

YouTubeLink.propTypes = {
  url: PropTypes.string,
};
