import { useTranslation } from "react-i18next";
import Button from "../../elements/button/button";
import styles from "./moreInfoModal.module.scss";
import PropTypes from "prop-types";
import { getDateOnlyFromISOString } from "../../../utilities/calendarUtilities";
export default function MoreInfoModal({ event, onDeleteSubmit, dispatch }) {
  const { t } = useTranslation();
  function handleClick() {
    dispatch(onDeleteSubmit(event.id));
  }

  return (
    <div className={styles.modalWindow}>
      <p>{event.title}</p>
      <p>{getDateOnlyFromISOString(event.start)}</p>
      <Button label={t("buttons.cancelReservation")} onClick={handleClick} />
      <p>ale strzeż się Baby Jagi</p>
    </div>
  );
}

MoreInfoModal.propTypes = {
  event: PropTypes.object,
  onDeleteSubmit: PropTypes.func,
  dispatch: PropTypes.func,
};
