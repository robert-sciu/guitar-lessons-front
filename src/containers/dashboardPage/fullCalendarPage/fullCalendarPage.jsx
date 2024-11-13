import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./fullCalendarPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addGhostEvent,
  clearGhostEvents,
  fetchReservations,
  selectEvents,
  selectReservationsFetchComplete,
  updateReservation,
} from "../../../store/fullCalendarSlice";
import { selectUserId } from "../../../store/userInfoSlice";
import { useTranslation } from "react-i18next";
import "./fullCalendarPage.css";
import NewReservationWindow from "../../../components/modalWindows/newReservationWIndow/newReservationWindow";

export default function FullCalendarPage() {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const reservationsFetchComplete = useSelector(
    selectReservationsFetchComplete
  );
  const { t } = useTranslation();

  const userId = useSelector(selectUserId);

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
    if (events !== eventsToDisplay) {
      setEventsToDisplay(events);
    }
  }, [events, eventsToDisplay]);

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

  function addGhostEventHandler(e) {
    dispatch(clearGhostEvents());
    const today = new Date().toISOString().split("T")[0];
    const start_UTC = new Date(e.dateStr).toISOString();
    if (start_UTC.split("T")[0] <= today) return;
    const end_UTC = new Date(
      new Date(start_UTC).getTime() + 60 * 60 * 1000
    ).toISOString();
    const event = {
      id: "ghost",
      user_id: userId,
      title: "Zerezerwuj",
      start: start_UTC,
      end: end_UTC,
    };
    dispatch(addGhostEvent(event));
  }

  return (
    <div className={styles.fullCalendarPageContainer}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        slotDuration={"00:30:00"}
        slotMinTime={"08:00:00"}
        slotMaxTime={"22:00:00"}
        allDaySlot={false}
        expandRows={true}
        height={"100%"}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: null,
        }}
        events={eventsToDisplay}
        editable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventDragMinDistance={5}
        eventOverlap={false}
        eventDrop={handleEventDragStop}
        eventResize={handleEventResize}
        dateClick={addGhostEventHandler}
      />
      <NewReservationWindow
        reservation={{ start_UTC: new Date().toISOString() }}
      />
    </div>
  );
}
