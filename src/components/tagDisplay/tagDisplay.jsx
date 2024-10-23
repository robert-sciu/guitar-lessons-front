import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./tagDisplay.module.scss";

export default function TagDisplay({ tag, onTagClick, clickable = true }) {
  const [selected, setSelected] = useState(false);

  function handleOnTagClick() {
    if (!clickable) return;
    setSelected(!selected);
    onTagClick(tag, selected);
  }
  return (
    <div
      className={`${styles.tagDisplay} ${selected ? styles.selected : ""} ${
        clickable ? "" : styles.disabled
      }`}
      onClick={handleOnTagClick}
    >
      <p>{tag.value}</p>
    </div>
  );
}

TagDisplay.propTypes = {
  tag: PropTypes.object,
  onTagClick: PropTypes.func,
  clickable: PropTypes.bool,
};
