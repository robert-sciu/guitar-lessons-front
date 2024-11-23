import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./fullCalendarPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addTempEvent,
  clearCalendarError,
  clearMoreInfoEvent,
  clearTempEvents,
  createReservation,
  deleteReservation,
  fetchReservations,
  selectCalendarError,
  selectCalendarHasError,
  selectCalendarRefetchNeeded,
  selectCalendarUpdateFailed,
  selectEvents,
  selectEventsUpdated,
  selectMoreInfoEvent,
  selectReservationsFetchComplete,
  selectTempEventData,
  selectTempRescheduleData,
  selectToday,
  selectWorkingHoursEnd,
  selectWorkingHoursStart,
  setCalendarError,
  setMoreInfoEvent,
  setTempRescheduleData,
  updateReservation,
} from "../../../store/fullCalendarSlice";
import { selectUserId } from "../../../store/userInfoSlice";
import { useTranslation } from "react-i18next";
import "./fullCalendarPage.css";
import {
  addMinutesToIsoString,
  checkIfReservationDurationIsAllowed,
  configureEvents,
  configureRescheduleDataFromEvent,
  getDateOnlyFromISOString,
  fullDateToISOString,
  getMinMaxSlots,
  objectHasData,
} from "../../../utilities/calendarUtilities";
import config from "../../../../config/config";
import ModalWindowMain from "../../../components/modalWindows/modalWindow/modalWindowMain";

export default function FullCalendarPage() {
  const [eventsToDisplay, setEventsToDisplay] = useState([]);

  // modal windows control

  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const { t } = useTranslation();
  //prettier-ignore
  const reservationsFetchComplete = useSelector(selectReservationsFetchComplete);
  const moreInfoEvent = useSelector(selectMoreInfoEvent);
  const tempEvent = useSelector(selectTempEventData);
  const tempRescheduleData = useSelector(selectTempRescheduleData);
  const userId = useSelector(selectUserId);
  const calendarStart = useSelector(selectWorkingHoursStart);
  const calendarEnd = useSelector(selectWorkingHoursEnd);
  const today = useSelector(selectToday);
  const calendarRefetchNeeded = useSelector(selectCalendarRefetchNeeded);
  const eventsUpdated = useSelector(selectEventsUpdated);
  const calendarHasError = useSelector(selectCalendarHasError);
  const calendarError = useSelector(selectCalendarError);
  const updateFailed = useSelector(selectCalendarUpdateFailed);

  useEffect(() => {
    if (reservationsFetchComplete && !calendarRefetchNeeded) return;
    dispatch(fetchReservations());
  }, [dispatch, reservationsFetchComplete, calendarRefetchNeeded]);

  useEffect(() => {
    if (updateFailed) {
      setEventsToDisplay(configureEvents(events, userId));
    }
  }, [updateFailed, events, userId]);

  useEffect(() => {
    if (eventsUpdated && !calendarRefetchNeeded) {
      setEventsToDisplay(configureEvents(events, userId));
    }
  }, [eventsUpdated, calendarRefetchNeeded, events, userId]);

  useEffect(() => {
    if (
      reservationsFetchComplete &&
      userId &&
      (eventsToDisplay.length === 0 || events.length !== eventsToDisplay.length)
    ) {
      const eventsToDisplay = configureEvents(events, userId);
      setEventsToDisplay(eventsToDisplay);
    }
  }, [events, reservationsFetchComplete, eventsToDisplay, userId, t, dispatch]);

  function setRescheduleData(e) {
    const data = configureRescheduleDataFromEvent(e.event);
    if (!checkIfReservationDurationIsAllowed(data.start_UTC, data.end_UTC)) {
      setEventsToDisplay(configureEvents(events, userId));
      dispatch(setCalendarError(t("errors.invalidDuration")));
      return;
    }
    dispatch(setTempRescheduleData(data));
  }

  function handleEventDragStop(e) {
    setRescheduleData(e);
  }

  function handleEventResize(e) {
    setRescheduleData(e);
  }

  function addTempEventHandler(e) {
    dispatch(clearTempEvents());
    const start_UTC = fullDateToISOString(e.dateStr);
    if (getDateOnlyFromISOString(start_UTC) <= today) {
      dispatch(setCalendarError(t("errors.cannotBookEarlierThanTomorrow")));
      return;
    }
    const event = {
      id: "ghost",
      user_id: userId,
      title: t("calendar.bookIt"),
      start: start_UTC,
      end: addMinutesToIsoString(start_UTC, config.defaultReservationLength),
    };
    dispatch(addTempEvent(event));
  }

  function showEventInfo(e) {
    const event = e.event;
    const date = getDateOnlyFromISOString(event.start);
    if (event.extendedProps.user_id !== userId) {
      dispatch(setCalendarError(t("errors.thatsNotMine")));
      return;
    }
    if (date < today) {
      dispatch(setCalendarError(t("errors.thatsPast")));
      return;
    }
    if (date === today) {
      dispatch(setCalendarError(t("errors.thatsToday")));
      return;
    }

    const eventData = {
      id: event.id,
      title: event.title,
      start: getDateOnlyFromISOString(event.start),
    };
    dispatch(setMoreInfoEvent(eventData));
  }
  const { minTime, maxTime } = getMinMaxSlots(calendarStart, calendarEnd);

  return (
    <div className={styles.fullCalendarPageContainer}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        slotDuration={"00:30:00"}
        slotMinTime={minTime}
        slotMaxTime={maxTime}
        allDaySlot={false}
        expandRows={true}
        height={"100%"}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: null,
        }}
        events={[...eventsToDisplay, tempEvent]}
        eventDragMinDistance={5}
        eventOverlap={false}
        eventDrop={handleEventDragStop}
        eventResize={handleEventResize}
        eventClick={showEventInfo}
        dateClick={addTempEventHandler}
      />
      {objectHasData(tempEvent) && (
        <ModalWindowMain
          modalType={"reservation"}
          data={tempEvent}
          onSubmit={createReservation}
          onCancel={clearTempEvents}
        />
      )}
      {objectHasData(tempRescheduleData) && (
        <ModalWindowMain
          modalType={"reschedule"}
          data={tempRescheduleData}
          onSubmit={updateReservation}
          onCancel={clearTempEvents}
        />
      )}
      {objectHasData(moreInfoEvent) && (
        <ModalWindowMain
          modalType={"moreInfo"}
          data={moreInfoEvent}
          onDeleteSubmit={deleteReservation}
          onCancel={clearMoreInfoEvent}
        />
      )}
      {calendarHasError && (
        <ModalWindowMain
          modalType={"error"}
          data={calendarError}
          onCancel={clearCalendarError}
        />
      )}
    </div>
  );
}
