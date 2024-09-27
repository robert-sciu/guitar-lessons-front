// import PropTypes from "prop-types";
// import BookingTile from "../bookingTile/bookingTile";
// import { useDrop } from "react-dnd";
// import { useEffect, useState } from "react";

// export default function CalendarHour({ hourData, isBooked, isLabel }) {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "reservation",
//     drop: (item, monitor) => {
//       console.log("Dropped item:", item); // Here you can handle the dropped item
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       style={{
//         border: "1px solid black",
//         backgroundColor: isOver ? "green" : "coral",
//         height: "100%",
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         position: "relative",
//       }}
//     >
//       {isLabel && <p>{`${hourData[0]}:00`}</p>}

//       <div
//         style={{
//           display: "block",
//           position: "relative",
//           width: "100%",
//           height: "20px",
//         }}
//       >
//         {booking && isBooked && isFirstHalf && (
//           <BookingTile reservation={booking} durationBlocks={durationBlocks} />
//         )}
//       </div>
//       <div
//         style={{
//           display: "block",
//           position: "relative",
//           width: "100%",
//           height: "20px",
//         }}
//       >
//         {booking && isBooked && !isFirstHalf && (
//           <BookingTile reservation={booking} durationBlocks={durationBlocks} />
//         )}
//       </div>
//     </div>
//   );
// }

// CalendarHour.propTypes = {
//   hourData: PropTypes.array,
//   isBooked: PropTypes.bool,
//   isLabel: PropTypes.bool,
// };
