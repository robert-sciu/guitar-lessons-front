import { useDispatch, useSelector } from "react-redux";
import CalendarWeek from "./calendarWeek.jsx/calendarWeek";
import {
  fetchLessonReservations,
  selectDatesAreSet,
  selectFetchReservationsComplete,
  // selectLessonReservations,
  setDates,
} from "../../../store/calendarSlice";
import { useEffect } from "react";
import { selectIsAuthenticated } from "../../../store/authSlice";

export default function Calendar() {
  // const allReservations = useSelector(selectLessonReservations);
  const fetchComplete = useSelector(selectFetchReservationsComplete);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const datesSet = useSelector(selectDatesAreSet);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!datesSet) dispatch(setDates());
  }, [dispatch, datesSet]);

  useEffect(() => {
    if (
      isAuthenticated &&
      // allReservations.length === 0 &&
      !fetchComplete &&
      datesSet
    )
      dispatch(fetchLessonReservations());
  }, [
    dispatch,
    isAuthenticated,
    fetchComplete,
    // allReservations.length,
    datesSet,
  ]);

  return (
    <div>
      {datesSet && fetchComplete ? <CalendarWeek /> : <p>Loading...</p>}
    </div>
  );
}
