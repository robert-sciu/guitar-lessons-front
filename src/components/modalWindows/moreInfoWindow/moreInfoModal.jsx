import styles from "./moreInfoModal.module.scss";
import { getDateOnlyFromISOString } from "../../../utilities/calendarUtilities";
import PropTypes from "prop-types";
export default function MoreInfoModal({ event, onDeleteSubmit, dispatch }) {
  function handleClick() {
    dispatch(onDeleteSubmit(event.id));
  }

  return (
    <div className={styles.modalWindow}>
      <p>{event.title}</p>
      <p>{getDateOnlyFromISOString(event.start)}</p>
      <button onClick={handleClick}>wypierdol</button>
    </div>
  );
}

MoreInfoModal.propTypes = {
  event: PropTypes.object,
  onDeleteSubmit: PropTypes.func,
  dispatch: PropTypes.func,
};
