import { IoMove, IoClose } from "react-icons/io5";
import styles from "./modalWindowMain.module.scss";
import Draggable from "react-draggable";
import { useRef } from "react";
import PropTypes from "prop-types";
import ReservationModal from "../reservationWindow/reservationModal";
import { useDispatch } from "react-redux";
import MoreInfoModal from "../moreInfoWindow/moreInfoModal";
import RescheduleModal from "../RescheduleModal/rescheduleModal";
import TaskDeleteModal from "../TaskDeleteModal/taskDeleteModal";
import CodeRequiredModal from "../codeRequiredModal/codeRequiredModal";
import ErrorWindow from "../errorWindow/errorWindow";
import ReservationDeleteModal from "../reservationDeleteModal/reservationDeleteModal";
import { clearTempData } from "../../../store/fullCalendarSlice";
import { classNameFormatter } from "../../../utilities/utilities";
import InfoModal from "../infoModal/infoModal";
export default function ModalWindowMain({
  modalType,
  onSubmit,
  OnConfirm,
  onCancel,
  onDeleteSubmit,
  data,
  disableBlur,
  additionalInfo,
}) {
  const dispatch = useDispatch();
  const nodeRef = useRef(null);
  function handleBgClick(e) {
    if (
      e.target.className.includes("modalWindowBackground") ||
      e.target.className.includes("blur")
    ) {
      if (onCancel) {
        dispatch(clearTempData());
        dispatch(onCancel());
      }
    }
  }
  function handleClose() {
    if (onCancel) {
      dispatch(onCancel());
    }
  }
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: ["modalWindowBackground", !disableBlur && "blur"],
      })}
      onClick={handleBgClick}
    >
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className={styles.modalWindowContainer}>
          <div className={styles.dragArea}>
            <div className={styles.closeBtn} onClick={handleClose}>
              <IoClose />
            </div>
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
              onSubmit={onSubmit}
              dispatch={dispatch}
              onCancel={onCancel}
            />
          )}
          {modalType === "confirmDelete" && (
            <ReservationDeleteModal
              data={data}
              onDeleteSubmit={onDeleteSubmit}
              onCancel={onCancel}
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
          {modalType === "codeRequired" && (
            <CodeRequiredModal
              onSubmit={onSubmit}
              onCancel={onCancel}
              dispatch={dispatch}
              additionalInfo={additionalInfo}
            />
          )}
          {modalType === "info" && (
            <InfoModal info={data} onConfirm={OnConfirm} />
          )}
          {modalType === "error" && (
            <ErrorWindow error={data} onCancel={onCancel} dispatch={dispatch} />
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
  data: PropTypes.any,
  disableBlur: PropTypes.bool,
  OnConfirm: PropTypes.func,
  additionalInfo: PropTypes.any,
};
