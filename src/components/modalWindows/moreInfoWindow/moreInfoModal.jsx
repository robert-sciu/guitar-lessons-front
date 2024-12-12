import { useTranslation } from "react-i18next";
import Button from "../../elements/button/button";
import styles from "./moreInfoModal.module.scss";
import PropTypes from "prop-types";
import {
  getLocalDateTimeFromIsoString,
  getLocalHourFromIsoString,
} from "../../../utilities/calendarUtilities";
import { useEffect, useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import ReservationCustomizer from "../reservationCustomizer/reservationCustomizer";
import {
  selectFullCalendarDataForMoreInfoInitial,
  updateDataForEventMoreInfo,
} from "../../../store/fullCalendarSlice";
import { useSelector } from "react-redux";
export default function MoreInfoModal({
  event,
  onDeleteSubmit,
  onSubmit,
  onCancel,
  dispatch,
}) {
  const [edit, setEdit] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const editable = new Date(event.freeEditExpiry) > new Date();
  const eventMoreInfoInitial = useSelector(
    selectFullCalendarDataForMoreInfoInitial
  );
  const { t } = useTranslation();

  function handleDelete() {
    dispatch(onDeleteSubmit({ id: event.id }));
  }

  useEffect(() => {
    if (JSON.stringify(eventMoreInfoInitial) !== JSON.stringify(event)) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  }, [eventMoreInfoInitial, event]);

  function handleClick(isConfirmed) {
    if (isConfirmed) {
      const reservationObject = {
        event_id: event.id,
        start_UTC: event.start,
        end_UTC: event.end,
        duration: event.duration,
      };

      // dispatch(clearDataForMoreInfo());
      onSubmit(reservationObject, true);
    } else {
      dispatch(onCancel());
    }
  }

  return (
    <div className={styles.modalWindow}>
      <p>{t("calendar.myReservation")}</p>

      {edit && (
        <ReservationCustomizer
          dataHandler={updateDataForEventMoreInfo}
          reservation={event}
          onClick={handleClick}
          showButtons={false}
        />
      )}
      {!edit && (
        <div className={styles.dateContainer} onClick={() => setEdit(true)}>
          <p>
            {t("calendar.date")}: {getLocalDateTimeFromIsoString(event.start)}
          </p>
        </div>
      )}
      <div className={edit ? styles.buttonsContainer : null}></div>

      {editable && (
        <p>
          {t("calendar.editFreely")}
          {getLocalHourFromIsoString(event.freeEditExpiry)}
        </p>
      )}

      <div className={styles.buttonsContainer}>
        {!edit && (
          <Button
            label={t("buttons.cancelReservation")}
            onClick={handleDelete}
            style={"redBtn"}
          />
        )}
        {edit && (
          <Button
            label={t("buttons.confirm")}
            onClick={() => handleClick(true)}
            style={"greenBtn"}
            disabled={!dataChanged}
          />
        )}

        <Button
          label={t("buttons.edit")}
          activeLabel={t("buttons.close")}
          isActive={edit}
          onClick={() => setEdit(!edit)}
          icon={<HiOutlinePencilSquare />}
        />
        <Button
          label={t("buttons.cancel")}
          onClick={() => handleClick(false)}
        />
      </div>
    </div>
  );
}

MoreInfoModal.propTypes = {
  event: PropTypes.object,
  onDeleteSubmit: PropTypes.func,
  dispatch: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
