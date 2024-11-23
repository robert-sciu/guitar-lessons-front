import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./fullCalendarPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addTempEvent,
  clearCalendarRefetchNeeded,
  clearMoreInfoEvent,
  clearTempEvents,
  createReservation,
  deleteReservation,
  fetchReservations,
  selectCalendarRefetchNeeded,
  selectEvents,
  selectMoreInfoEvent,
  selectReservationsFetchComplete,
  selectTempEventData,
  selectTempRescheduleData,
  selectToday,
  selectWorkingHoursEnd,
  selectWorkingHoursStart,
  setEventForUpdateId,
  setMoreInfoEvent,
  setTempRescheduleData,
  updateReservation,
} from "../../../store/fullCalendarSlice";
import { selectUserId } from "../../../store/userInfoSlice";
import { useTranslation } from "react-i18next";
import "./fullCalendarPage.css";
// import ReservationWindow from "../../../components/modalWindows/reservationWIndow/reservationWindow";
import {
  addMinutesToIsoString,
  checkIfReservationDurationIsAllowed,
  configureEvents,
  configureRescheduleDataFromEvent,
  getDateOnlyFromISOString,
  fullDateToISOString,
  // getHourFromISOString,
  getMinMaxSlots,
  objectHasData,
  // getMinutesFromISOString,
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

  useEffect(() => {
    if (reservationsFetchComplete && !calendarRefetchNeeded) return;
    dispatch(fetchReservations());
    dispatch(clearCalendarRefetchNeeded());
  }, [dispatch, reservationsFetchComplete, calendarRefetchNeeded]);

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
      return;
    }
    dispatch(setTempRescheduleData(data));
    dispatch(setEventForUpdateId(data.event_id));
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
    if (getDateOnlyFromISOString(start_UTC) <= today) return;
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
    const event = {
      id: e.event.id,
      title: e.event.title,
      start: getDateOnlyFromISOString(e.event.start),
    };
    dispatch(setMoreInfoEvent(event));
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
    </div>
  );
}
