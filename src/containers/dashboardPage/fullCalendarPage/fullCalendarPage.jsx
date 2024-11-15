import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./fullCalendarPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addTempEvent,
  clearTempEvents,
  fetchReservations,
  selectEvents,
  selectReservationsFetchComplete,
  selectTempEventData,
  selectWorkingHoursEnd,
  selectWorkingHoursStart,
  updateReservation,
} from "../../../store/fullCalendarSlice";
import { selectUserId } from "../../../store/userInfoSlice";
import { useTranslation } from "react-i18next";
import "./fullCalendarPage.css";
import ReservationWindow from "../../../components/modalWindows/reservationWIndow/reservationWindow";
import {
  addMinutesToIsoString,
  dateOnlyFromISOString,
  formatBusinessHours,
  fullDateToISOString,
  getMinMaxSlots,
  getTodayDate,
} from "../../../utilities/calendarUtilities";

export default function FullCalendarPage() {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const [tempEventToDisplay, setTempEventToDisplay] = useState({});
  const reservationsFetchComplete = useSelector(
    selectReservationsFetchComplete
  );
  const { t } = useTranslation();
  const tempEvent = useSelector(selectTempEventData);
  const userId = useSelector(selectUserId);
  const calendarStart = useSelector(selectWorkingHoursStart);
  const calendarEnd = useSelector(selectWorkingHoursEnd);
  useEffect(() => {
    if (reservationsFetchComplete) return;
    dispatch(fetchReservations());
  }, [dispatch, reservationsFetchComplete]);

  useEffect(() => {
    if (reservationsFetchComplete && eventsToDisplay.length === 0 && userId) {
      const eventsToDisplay = events.map((event) => {
        return event.user_id === userId
          ? { ...event, title: t("calendar.myReservation") }
          : { ...event, editable: false };
      });
      setEventsToDisplay(eventsToDisplay);
    }
  }, [events, reservationsFetchComplete, eventsToDisplay, userId, t]);

  useEffect(() => {
    if (tempEvent) {
      setTempEventToDisplay(tempEvent);
    }
  }, [tempEvent]);

  useEffect(() => {
    if (events !== eventsToDisplay || tempEvent !== tempEventToDisplay) {
      setEventsToDisplay(events);
    }
  }, [events, eventsToDisplay, tempEvent, tempEventToDisplay]);

  function rescheduleEvent(e) {
    const start_UTC = new Date(e.event.start).toISOString();
    const end_UTC = new Date(e.event.end).toISOString();
    const duration = (e.event.end - e.event.start) / 60000;
    const event_id = e.event.id;
    dispatch(updateReservation({ event_id, start_UTC, end_UTC, duration }));
  }

  function handleEventDragStop(e) {
    rescheduleEvent(e);
  }

  function handleEventResize(e) {
    rescheduleEvent(e);
  }

  function addTempEventHandler(e) {
    dispatch(clearTempEvents());
    const today = getTodayDate();
    const start_UTC = fullDateToISOString(e.dateStr);
    if (dateOnlyFromISOString(start_UTC) <= today) return;
    // 60 min lesson by default
    const end_UTC = addMinutesToIsoString(start_UTC, 60);
    const event = {
      id: "ghost",
      user_id: userId,
      title: "Zerezerwuj",
      start: start_UTC,
      end: end_UTC,
    };
    dispatch(addTempEvent(event));
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
        businessHours={formatBusinessHours(calendarStart, calendarEnd)}
        events={[...eventsToDisplay, tempEvent]}
        editable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventDragMinDistance={5}
        eventOverlap={false}
        eventDrop={handleEventDragStop}
        eventResize={handleEventResize}
        dateClick={addTempEventHandler}
      />
      {Object.keys(tempEvent).length > 0 && (
        <ReservationWindow
          reservation={tempEvent}
          dismissHandler={clearTempEvents}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
