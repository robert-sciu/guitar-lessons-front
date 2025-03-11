import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
  addDaysToLocalDate,
} from "../../../utilities/calendarUtilities";
import DashboardContentContainer from "../../dashboardContentContainer/DashboardContentContainer";
import useReduxFetch from "../../../hooks/useReduxFetch";

export default function FullCalendarPage() {
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const calendarRef = useRef(null);

  const dispatch = useDispatch();

  const fullCalendarEvents = useSelector(selectFullCalendarEvents);
  //prettier-ignore
  const isFetchComplete = useSelector(selectFullCalendarFetchStatus);
  const eventMoreInfo = useSelector(selectFullCalendarDataForMoreInfo);

  const dataForEventCreation = useSelector(
    selectFullCalendarTempDataForCreation
  );

  useReduxFetch({
    fetchAction: fetchCalendarEvents,
    fetchCompleteSelector: selectFullCalendarFetchStatus,
    loadingSelector: selectFullCalendarLoadingStatus,
    errorSelector: selectFullCalendarErrorStatus,
    refetchSelector: selectFullCalendarRefetchNeeded,
  });

  const calendarStartHour = useSelector(selectAvailabilityStartHour);
  const calendarEndHour = useSelector(selectAvailabilityEndHour);
  const todayDate = useSelector(selectTodayDate);
  const endDay = useSelector(selectEndDay);
  const userId = useSelector(selectUserId);

  const { t } = useTranslation();

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
  }, [dataForEventCreation, todayDate]);

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
    if (info.isPast) {
      return ["unavailable"];
    }
    if (info.isToday) {
      if (!endDate) {
        setEndDate(addDaysToLocalDate(info.date, 14));
      }
      return ["today"];
    }
    if (info.isFuture && info.date >= endDate) {
      return ["unavailable"];
    }
    return ["available"];
  };

  return (
    <DashboardContentContainer
      showContent={isFetchComplete}
      isStretchedVertically={true}
      showCalendarNavigation={true}
      calendarBtnNextHandler={handleGoNext}
      calendarBtnPrevHandler={handleGoPrev}
      nextButtonDisabled={nextButtonDisabled}
      prevButtonDisabled={prevButtonDisabled}
      contentCol={
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
          events={[...fullCalendarEvents, dataForEventCreation, eventMoreInfo]}
          eventDragMinDistance={5}
          eventOverlap={false}
          eventDrop={handleEventDragStop}
          eventResize={handleEventResize}
          eventClick={handleShowEventInfo}
          dateClick={handleCreateEvent}
          eventColor={"#10a710"}
          locale={"pl"}
          dayCellClassNames={handleDayCellClassNames}
          datesSet={handleDatesSet}
        />
      }
      modals={[
        {
          modalType: "reservation",
          showModal: objectHasData(
            useSelector(selectFullCalendarTempDataForCreation)
          ),
          data: useSelector(selectFullCalendarTempDataForCreation),
          onSubmit: createCalendarEvent,
          onCancel: clearTempData,
          disableBlur: true,
        },
        {
          modalType: "reschedule",
          showModal: objectHasData(
            useSelector(selectFullCalendarTempDataForReschedule)
          ),
          data: useSelector(selectFullCalendarTempDataForReschedule),
          onSubmit: updateCalendarEvent,
          onCancel: clearTempData,
          disableBlur: true,
        },
        {
          modalType: "moreInfo",
          showModal: objectHasData(
            useSelector(selectFullCalendarDataForMoreInfo)
          ),
          data: useSelector(selectFullCalendarDataForMoreInfo),
          onSubmit: handleEventReschedule,
          onDeleteSubmit: setTempDataForEventDeletion,
          onCancel: clearTempData,
          disableBlur: true,
        },
        {
          modalType: "confirmDelete",
          showModal: objectHasData(
            useSelector(selectFullCalendarEventToDeleteId)
          ),
          data: useSelector(selectFullCalendarEventToDeleteId),
          onDeleteSubmit: deleteCalendarEvent,
          onCancel: clearTempDataForEventDeletion,
        },
        {
          modalType: "error",
          showModal: useSelector(selectFullCalendarErrorStatus),
          data: useSelector(selectFullCalendarErrorMessage),
          onCancel: clearFullCalendarError,
        },
      ]}
    />
  );
}
