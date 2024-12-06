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
  selectFullCalendarFetchStatus,
  selectFullCalendarLoadingStatus,
  selectFullCalendarRefetchNeeded,
  selectFullCalendarTempDataForCreation,
  selectFullCalendarTempDataForReschedule,
  // selectFullCalendarWorkingHoursEnd,
  // selectFullCalendarWorkingHoursStart,
  selectTodayDate,
  // selectWokringHours2,
  setDataForEventMoreInfo,
  setFullCalendarError,
  setTempDataForEventCreation,
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
  // getMinMaxSlots,
  objectHasData,
  checkIfReservationDateIsAllowed,
  checkIfReservationTimeIsAllowed,
  // configWorkingHours,
} from "../../../utilities/calendarUtilities";

export default function FullCalendarPage() {
  // modal windows control
  const [fetchComplete, setFetchComplete] = useState(false);
  const [calendarPage, setCalendarPage] = useState(0);

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
  const calendarStartHour = useSelector(selectAvailabilityStartHour);
  const calendarEndHour = useSelector(selectAvailabilityEndHour);
  const todayDate = useSelector(selectTodayDate);
  const endDay = useSelector(selectEndDay);
  const userId = useSelector(selectUserId);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isFetchComplete && !isLoading && !hasError) {
      dispatch(fetchCalendarEvents());
    }
  }, [dispatch, isFetchComplete, isLoading, hasError]);

  useEffect(() => {
    if (needsRefetch) {
      dispatch(fetchCalendarEvents());
    }
  }, [dispatch, needsRefetch]);

  // const { minTime, maxTime } = getMinMaxSlots(
  //   calendarStartHour,
  //   calendarEndHour
  // );

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
      id: event.id,
      title: event.title,
      start: getDateOnlyFromISOString(event.start),
    };
    dispatch(setDataForEventMoreInfo(eventData));
  }

  function handleEventReschedule(e) {
    const data = configureRescheduleDataFromEvent(e.event);
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
    setCalendarPage((prev) => prev + 1);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  }

  function handleGoPrev() {
    setCalendarPage((prev) => prev - 1);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
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
            disabled={calendarPage === 0}
          />

          <Button
            label={t("buttons.nextWeek")}
            onClick={handleGoNext}
            disabled={calendarPage === 2}
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
            events={[...fullCalendarEvents, dataForEventCreation]}
            eventDragMinDistance={5}
            eventOverlap={false}
            eventDrop={handleEventDragStop}
            eventResize={handleEventResize}
            eventClick={handleShowEventInfo}
            dateClick={handleCreateEvent}
            eventColor={"#10a710"}
            locale={"pl"}
            dayCellClassNames={handleDayCellClassNames}
            // firstDay={1}
          />
        )}
      </div>

      {objectHasData(dataForEventCreation) && (
        <ModalWindowMain
          modalType={"reservation"}
          data={dataForEventCreation}
          onSubmit={createCalendarEvent}
          onCancel={clearTempData}
        />
      )}
      {objectHasData(dataForEventReschedule) && (
        <ModalWindowMain
          modalType={"reschedule"}
          data={dataForEventReschedule}
          onSubmit={updateCalendarEvent}
          onCancel={clearTempData}
        />
      )}
      {objectHasData(eventMoreInfo) && (
        <ModalWindowMain
          modalType={"moreInfo"}
          data={eventMoreInfo}
          onDeleteSubmit={deleteCalendarEvent}
          onCancel={clearTempData}
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
