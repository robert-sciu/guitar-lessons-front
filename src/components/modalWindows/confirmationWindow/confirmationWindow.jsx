import PropTypes from "prop-types";

export default function ConfirmationWindow({
  confirmationInfoHTML,
  confirmHandler,
  dataForHandler,
  dismissHandler,
  dispatch,
}) {
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      dispatch(confirmHandler(dataForHandler));
    } else {
      dispatch(dismissHandler());
    }
  }
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
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        <div>{confirmationInfoHTML}</div>
        <div>
          <button onClick={() => handleClick(true)}>Yes</button>
          <button onClick={() => handleClick(false)}>No</button>
        </div>
      </div>
    </div>
  );
}

ConfirmationWindow.propTypes = {
  confirmationInfoHTML: PropTypes.node.isRequired,
  confirmHandler: PropTypes.func.isRequired,
  dismissHandler: PropTypes.func.isRequired,
  dataForHandler: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
