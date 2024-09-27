import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

export default function BookingTile({ reservation, durationBlocks }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "reservation",
    item: { reservation: reservation },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const height = durationBlocks * 100;

  return (
    <div
      ref={drag}
      style={{
        backgroundColor: "green",
        position: "absolute",
        top: 0,
        height: `${height}%`,
        width: "100%",
        zIndex: 100,
        curson: "pointer",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      reservation
    </div>
  );
}

BookingTile.propTypes = {
  reservation: PropTypes.object,
  durationBlocks: PropTypes.number,
};
