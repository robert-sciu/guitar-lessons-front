import { IoMove } from "react-icons/io5";
import styles from "./modalWindowMain.module.scss";
import Draggable from "react-draggable";
import { useRef } from "react";
import PropTypes from "prop-types";
import ReservationModal from "../reservationWIndow/reservationModal";
import { useDispatch } from "react-redux";
import MoreInfoModal from "../moreInfoWindow/moreInfoModal";
import RescheduleModal from "../RescheduleModal/rescheduleModal";
import TaskDeleteModal from "../TaskDeleteModal/taskDeleteModal";
export default function ModalWindowMain({
  modalType,
  onSubmit,
  onCancel,
  onClose,
  onDeleteSubmit,
  data,
}) {
  const dispatch = useDispatch();
  const nodeRef = useRef(null);
  function handleBgClick() {
    if (onCancel) {
      dispatch(onCancel());
    }
    if (onClose) {
      dispatch(onClose());
    }
  }
  return (
    <div className={styles.modalWindowBackground} onClick={handleBgClick}>
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className={styles.modalWindowContainer}>
          <div className={styles.dragArea}>
            <IoMove />
          </div>
          {modalType === "reservation" && (
            <ReservationModal
              reservation={data}
              onSubmit={onSubmit}
              onCancel={onCancel}
              dispatch={dispatch}
            />
          )}
          {modalType === "moreInfo" && (
            <MoreInfoModal
              event={data}
              onDeleteSubmit={onDeleteSubmit}
              dispatch={dispatch}
            />
          )}
          {modalType === "reschedule" && (
            <RescheduleModal
              reservation={data}
              onSubmit={onSubmit}
              onCancel={onCancel}
              dispatch={dispatch}
            />
          )}
          {modalType === "taskDelete" && (
            <TaskDeleteModal
              onSubmit={onSubmit}
              onCancel={onCancel}
              taskId={data}
              dispatch={dispatch}
            />
          )}
        </div>
      </Draggable>
    </div>
  );
}

ModalWindowMain.propTypes = {
  modalType: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onDeleteSubmit: PropTypes.func,
  data: PropTypes.object,
};
