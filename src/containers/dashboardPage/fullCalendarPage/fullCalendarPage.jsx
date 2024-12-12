import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LoadingState from "../../../components/loadingState/loadingState";
import Button from "../../../components/elements/button/button";
import ModalWindowMain from "../../../components/modalWindows/modalWindow/modalWindowMain";

import { selectUserId } from "../../../store/userInfoSlice";
import {
  clearFullCalendarError,
  clearTempData,
  clearTempDataForEventDeletion,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvents,
  selectAvailabilityEndHour,
  selectAvailabilityStartHour,
  selectEndDay,
  selectFullCalendarDataForMoreInfo,
  selectFullCalendarErrorMessage,
  selectFullCalendarErrorStatus,
  selectFullCalendarEvents,
  selectFullCalendarEventToDeleteId,
  selectFullCalendarFetchStatus,
  selectFullCalendarLoadingStatus,
  selectFullCalendarRefetchNeeded,
  selectFullCalendarTempDataForCreation,
  selectFullCalendarTempDataForReschedule,
  selectTodayDate,
  setDataForEventMoreInfo,
  setFullCalendarError,
  setTempDataForEventCreation,
  setTempDataForEventDeletion,
  setTempDataForEventReschedule,
  updateCalendarEvent,
} from "../../../store/fullCalendarSlice";
import {
  selectFullCalendarPageLoaded,
  setFullCalendarPageLoaded,
} from "../../../store/loadStateSlice";

import styles from "./fullCalendarPage.module.scss";
import "./fullCalendarPage.css";

import config from "../../../../config/config";

import {
  addMinutesToIsoString,
  checkIfReservationDurationIsAllowed,
  configureRescheduleDataFromEvent,
  getDateOnlyFromISOString,
  fullDateToISOString,
  objectHasData,
  checkIfReservationDateIsAllowed,
  checkIfReservationTimeIsAllowed,
} from "../../../utilities/calendarUtilities";

export default function FullCalendarPage() {
  // modal windows control
  const [fetchComplete, setFetchComplete] = useState(false);
  // const [calendarPage, setCalendarPage] = useState(0);
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const calendarRef = useRef(null);

  const dispatch = useDispatch();

  const dataLoaded = useSelector(selectFullCalendarPageLoaded);

  const fullCalendarEvents = useSelector(selectFullCalendarEvents);
  //prettier-ignore
  const isFetchComplete = useSelector(selectFullCalendarFetchStatus);
  const isLoading = useSelector(selectFullCalendarLoadingStatus);
  const needsRefetch = useSelector(selectFullCalendarRefetchNeeded);
  const hasError = useSelector(selectFullCalendarErrorStatus);
  const errorMessage = useSelector(selectFullCalendarErrorMessage);
  const eventMoreInfo = useSelector(selectFullCalendarDataForMoreInfo);

  const dataForEventCreation = useSelector(
    selectFullCalendarTempDataForCreation
  );
  const dataForEventReschedule = useSelector(
    selectFullCalendarTempDataForReschedule
  );
  const dataForEventDeletion = useSelector(selectFullCalendarEventToDeleteId);

  const calendarStartHour = useSelector(selectAvailabilityStartHour);
  const calendarEndHour = useSelector(selectAvailabilityEndHour);
  const todayDate = useSelector(selectTodayDate);
  const endDay = useSelector(selectEndDay);
  const userId = useSelector(selectUserId);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isFetchComplete && !isLoading && !hasError && userId) {
      dispatch(fetchCalendarEvents());
    }
  }, [dispatch, isFetchComplete, isLoading, hasError, userId]);

  useEffect(() => {
    if (needsRefetch) {
      dispatch(fetchCalendarEvents());
    }
  }, [dispatch, needsRefetch]);

  useEffect(() => {
    if (objectHasData(eventMoreInfo)) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(eventMoreInfo.start);
    }
  }, [eventMoreInfo]);

  useEffect(() => {
    if (objectHasData(dataForEventCreation)) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(dataForEventCreation.start);
    }
  }, [dataForEventCreation, endDay, todayDate]);

  function handleCreateEvent(e) {
    dispatch(clearTempData());
    const start_UTC = fullDateToISOString(e.dateStr);

    if (getDateOnlyFromISOString(start_UTC) <= todayDate) {
      dispatch(setFullCalendarError(t("errors.cannotBookEarlierThanTomorrow")));
      return;
    }
    if (
      getDateOnlyFromISOString(start_UTC) > getDateOnlyFromISOString(endDay)
    ) {
      dispatch(setFullCalendarError(t("errors.cannotBookAfterEndDay")));
      return;
    }
    const event = {
      id: "ghost",
      user_id: userId,
      title: t("calendar.bookIt"),
      start: start_UTC,
      end: addMinutesToIsoString(start_UTC, config.defaultReservationLength),
      duration: config.defaultReservationLength,
    };
    dispatch(setTempDataForEventCreation(event));
  }

  function handleShowEventInfo(e) {
    const event = e.event;
    const date = getDateOnlyFromISOString(event.start);
    if (event.extendedProps.user_id !== userId) {
      dispatch(setFullCalendarError(t("errors.thatsNotMine")));
      return;
    }
    if (date < todayDate) {
      dispatch(setFullCalendarError(t("errors.thatsPast")));
      return;
    }
    if (date === todayDate) {
      dispatch(setFullCalendarError(t("errors.thatsToday")));
      return;
    }
    const eventData = {
      id: Number(event.id),
      title: t("calendar.editing"),
      color: "#10a710a1",
      user_id: event.extendedProps.user_id,
      start: fullDateToISOString(event.start),
      end: fullDateToISOString(event.end),
      duration: event.extendedProps.duration_min,
      freeEditExpiry: event.extendedProps.free_edit_expiry,
    };
    dispatch(setDataForEventMoreInfo(eventData));
  }

  function handleEventReschedule(e, isFormatted = false) {
    const data = isFormatted ? e : configureRescheduleDataFromEvent(e.event);

    const { start_UTC, end_UTC } = data;
    if (!checkIfReservationDurationIsAllowed(start_UTC, end_UTC)) {
      dispatch(setFullCalendarError(t("errors.invalidDuration")));
      return;
    }
    if (!checkIfReservationDateIsAllowed(start_UTC, end_UTC, todayDate)) {
      dispatch(setFullCalendarError(t("errors.cannotBookEarlierThanTomorrow")));
      return;
    }
    if (!checkIfReservationTimeIsAllowed(start_UTC, end_UTC)) {
      dispatch(setFullCalendarError(t("errors.cannotBookOutsideWorkingHours")));
      return;
    }
    if (
      getDateOnlyFromISOString(start_UTC) > getDateOnlyFromISOString(endDay)
    ) {
      dispatch(setFullCalendarError(t("errors.cannotBookAfterEndDay")));
      return;
    }
    dispatch(setTempDataForEventReschedule(data));
  }

  function handleEventDragStop(e) {
    handleEventReschedule(e);
  }

  function handleEventResize(e) {
    handleEventReschedule(e);
  }

  function handleGoNext() {
    setPrevButtonDisabled(false);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  }

  function handleGoPrev() {
    setNextButtonDisabled(false);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  }

  function handleDatesSet(info) {
    const firstVisibleDate = info.start; // First displayed date
    const lastVisibleDate = info.end; // Last displayed date
    if (new Date(firstVisibleDate) < new Date(todayDate)) {
      setPrevButtonDisabled(true);
    } else {
      setPrevButtonDisabled(false);
    }
    if (new Date(lastVisibleDate) > new Date(endDay)) {
      setNextButtonDisabled(true);
    } else {
      setNextButtonDisabled(false);
    }
  }

  const handleDayCellClassNames = (info) => {
    const date = info.date.toISOString(); // Format date as YYYY-MM-DD

    const dateOnly = getDateOnlyFromISOString(date);
    const endDateOnly = getDateOnlyFromISOString(endDay);

    if (dateOnly >= endDateOnly) {
      return ["unavailable"];
    }
    if (dateOnly < todayDate) {
      return ["unavailable"];
    }
    return ["available"];
  };

  useEffect(() => {
    if (isFetchComplete) {
      setFetchComplete(true);
      dispatch(setFullCalendarPageLoaded());
    }
  }, [dispatch, isFetchComplete]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.calendarContainer}>
        <div className={styles.buttonsContainer}>
          <Button
            label={t("buttons.previousWeek")}
            onClick={handleGoPrev}
            disabled={prevButtonDisabled}
          />

          <Button
            label={t("buttons.nextWeek")}
            onClick={handleGoNext}
            disabled={nextButtonDisabled}
          />
        </div>

        {(fetchComplete || dataLoaded) && (
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            slotDuration={"00:30:00"}
            slotMinTime={calendarStartHour}
            slotMaxTime={calendarEndHour}
            allDaySlot={false}
            expandRows={true}
            height={"100%"}
            headerToolbar={{
              left: null,
              center: "title",
              right: null,
            }}
            events={[
              ...fullCalendarEvents,
              dataForEventCreation,
              eventMoreInfo,
            ]}
            eventDragMinDistance={5}
            eventOverlap={false}
            eventDrop={handleEventDragStop}
            eventResize={handleEventResize}
            eventClick={handleShowEventInfo}
            dateClick={handleCreateEvent}
            eventColor={"#10a710"}
            locale={"pl"}
            dayCellClassNames={handleDayCellClassNames}
            // validRange={{
            //   start: todayDate,
            //   end: endDay,
            // }}
            // firstDay={1}
            datesSet={handleDatesSet}
          />
        )}
      </div>

      {!hasError && objectHasData(dataForEventCreation) && (
        <ModalWindowMain
          modalType={"reservation"}
          data={dataForEventCreation}
          onSubmit={createCalendarEvent}
          onCancel={clearTempData}
          disableBlur={true}
        />
      )}
      {!hasError && objectHasData(dataForEventReschedule) && (
        <ModalWindowMain
          modalType={"reschedule"}
          data={dataForEventReschedule}
          onSubmit={updateCalendarEvent}
          onCancel={clearTempData}
          disableBlur={true}
        />
      )}
      {!hasError &&
        !objectHasData(dataForEventReschedule) &&
        !objectHasData(dataForEventDeletion) &&
        objectHasData(eventMoreInfo) && (
          <ModalWindowMain
            modalType={"moreInfo"}
            data={eventMoreInfo}
            onSubmit={handleEventReschedule}
            onDeleteSubmit={setTempDataForEventDeletion}
            onCancel={clearTempData}
            disableBlur={true}
          />
        )}
      {!hasError && objectHasData(dataForEventDeletion) && (
        <ModalWindowMain
          modalType={"confirmDelete"}
          data={dataForEventDeletion}
          onDeleteSubmit={deleteCalendarEvent}
          onCancel={clearTempDataForEventDeletion}
        />
      )}
      {hasError && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessage}
          onCancel={clearFullCalendarError}
        />
      )}
      <LoadingState fadeOut={fetchComplete} inactive={dataLoaded} />
    </div>
  );
}
