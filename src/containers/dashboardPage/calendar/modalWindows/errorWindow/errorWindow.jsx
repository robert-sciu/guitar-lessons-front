import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

export default function ErrorWindow({ error, dismissHandler }) {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <p style={{ color: "black" }}>{error}</p>
        <button
          onClick={() => {
            dispatch(dismissHandler());
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

ErrorWindow.propTypes = {
  error: PropTypes.string.isRequired,
  dismissHandler: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
