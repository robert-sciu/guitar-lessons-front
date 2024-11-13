import { useDispatch, useSelector } from "react-redux";
import CalendarWeek from "../calendarWeek.jsx/calendarWeek";
import {
  clearNewReservationData,
  clearUpdateData,
  setDates,
  setFetchCompleteForReschedule,
  clearCalendarError,
} from "../../../../store/calendar/calendarSlice";
import { useEffect } from "react";
import { selectIsAuthenticated, selectUser } from "../../../../store/authSlice";
import ConfirmationWindow from "../../../../components/modalWindows/confirmationWindow/confirmationWindow";
import { fetchPlanInfo } from "../../../../store/planInfoSlice";
import ErrorWindow from "../../../../components/modalWindows/errorWindow/errorWindow";
import NewReservationWindow from "../../../../components/modalWindows/newReservationWIndow/newReservationWindow";

import {
  selectUpdateData,
  selectCalendarError,
  selectDatesAreSet,
  selectEventToDelete,
  selectFetchCompleteForNewReservation,
  selectFetchCompleteForReschedule,
  selectFetchReservationsComplete,
  selectNewReservation,
  selectRescheduleConfirmationNeeded,
  selectShowDetailsModalWindow,
  selectShowNewReservationModalWindow,
} from "../../../../store/calendar/calendarSelectors";
import {
  createLessonReservation,
  deleteLessonReservation,
  fetchLessonReservations,
  updateLessonReservation,
} from "../../../../store/calendar/calendarThunks";
import styles from "./calendarMain.module.scss";
import ReservationDetailsModal from "../reservationDetailsModal/reservationDetailsModal";

export default function CalendarMain() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const datesSet = useSelector(selectDatesAreSet);
  const fetchComplete = useSelector(selectFetchReservationsComplete);

  const rescheduleConfirmationNeeded = useSelector(
    selectRescheduleConfirmationNeeded
  );
  const fetchCompleteForReschedule = useSelector(
    selectFetchCompleteForReschedule
  );
  const fetchCompleteForNewReservation = useSelector(
    selectFetchCompleteForNewReservation
  );
  const showDetailsModalWindow = useSelector(selectShowDetailsModalWindow);
  const showNewReservationWindow = useSelector(
    selectShowNewReservationModalWindow
  );
  const updateData = useSelector(selectUpdateData);
  const newReservation = useSelector(selectNewReservation);
  const deleteEventData = useSelector(selectEventToDelete);
  const calendarError = useSelector(selectCalendarError);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!datesSet) dispatch(setDates());
  }, [dispatch, datesSet, user]);

  useEffect(() => {
    if (isAuthenticated && !fetchComplete && datesSet)
      dispatch(fetchLessonReservations());
  }, [dispatch, isAuthenticated, fetchComplete, datesSet]);

  useEffect(() => {
    if (fetchCompleteForReschedule) {
      dispatch(setFetchCompleteForReschedule(false));
      dispatch(fetchPlanInfo());
    }
  }, [dispatch, fetchCompleteForReschedule, fetchCompleteForNewReservation]);

  useEffect(() => {
    if (Object.keys(deleteEventData).length > 0) {
      dispatch(deleteLessonReservation(deleteEventData.id));
      dispatch(fetchPlanInfo());
    }
  }, [dispatch, deleteEventData]);
  return (
    <div className={styles.calendarMainContainer}>
      {datesSet && fetchComplete ? <CalendarWeek /> : <p>Loading...</p>}

      {rescheduleConfirmationNeeded && (
        <ConfirmationWindow
          confirmationInfoHTML={
            <div>
              <p>Are you sure you want to update this reservation?</p>
              <p>New date: {updateData.newDate}</p>
              <p>
                New time: {updateData.newHour}:{updateData.newMinute}
                {updateData.newMinute === 0 ? "0" : ""}
              </p>
              {/* <p>Reschedules left {planInfo.reschedules_left_count} </p> */}
            </div>
          }
          confirmHandler={updateLessonReservation}
          dataForHandler={updateData}
          dismissHandler={clearUpdateData}
          dispatch={dispatch}
        />
      )}

      {calendarError && (
        <ErrorWindow
          error={calendarError}
          dismissHandler={clearCalendarError}
          dispatch={dispatch}
        />
      )}
      {showNewReservationWindow && (
        <NewReservationWindow
          reservation={newReservation}
          confirmHandler={createLessonReservation}
          dismissHandler={clearNewReservationData}
          dispatch={dispatch}
        />
      )}

      {showDetailsModalWindow && <ReservationDetailsModal />}
    </div>
  );
}
