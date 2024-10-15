import PropTypes from "prop-types";
import { useState } from "react";

export default function NewReservationWindow({
  reservation,
  confirmHandler,
  dismissHandler,
  dispatch,
}) {
  const [selectedTime, setSelectedTime] = useState(60);
  function handleClick(isConfirmed) {
    if (isConfirmed) {
      const data = {
        date: reservation.date,
        hour: reservation.hour,
        minute: reservation.minute,
        duration: selectedTime,
      };
      dispatch(confirmHandler(data));
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
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <p style={{ color: "black" }}>New reservation</p>
        <p style={{ color: "black" }}>date: {reservation.date}</p>
        <p style={{ color: "black" }}>
          hour: {reservation.hour}:{reservation.minute}
          {reservation.minute === 0 ? "0" : ""}
        </p>
        <label htmlFor="time-select">choose time:</label>
        <select
          id="time-select"
          name={"time-select"}
          onChange={(e) => setSelectedTime(e.target.value)}
          value={selectedTime}
        >
          <option value={30}>30 min</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>

        <button onClick={() => handleClick(true)}>Add</button>
        <button onClick={() => handleClick(false)}>Cancel</button>
      </div>
    </div>
  );
}

NewReservationWindow.propTypes = {
  reservation: PropTypes.object,
  user: PropTypes.object,
  confirmHandler: PropTypes.func,
  dismissHandler: PropTypes.func,
  dispatch: PropTypes.func,
};
