import PropTypes from "prop-types";
import { useState } from "react";

export default function TagDisplay({ tag, onTagClick }) {
  const [selected, setSelected] = useState(false);

  function handleOnTagClick() {
    setSelected(!selected);
    onTagClick(tag, selected);
  }
  return (
    <div
      style={{
        backgroundColor: selected ? "green" : "coral",
        display: "inline-block",
        fontSize: "20px",
        margin: "0 10px 10px 0",
        padding: "5px 10px",
        textAlign: "center",
        width: "fit-content",
      }}
    >
      <div>
        <p>{tag.value}</p>
        {onTagClick && (
          <button onClick={handleOnTagClick}>{selected ? "-" : "+"}</button>
        )}
      </div>
    </div>
  );
}

TagDisplay.propTypes = {
  tag: PropTypes.object,
  onTagClick: PropTypes.func,
};
