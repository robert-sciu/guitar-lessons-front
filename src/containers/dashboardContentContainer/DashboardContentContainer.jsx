import { useTranslation } from "react-i18next";
import Button from "../../components/elements/button/button";
import LoadingState from "../../components/loadingState/loadingState";
import ModalWindowMain from "../../components/modalWindows/modalWindow/modalWindowMain";
import { classNameFormatter } from "../../utilities/utilities";
import styles from "./dashboardContentContainer.module.scss";
import PropTypes from "prop-types";

export default function DashboardContentContainer({
  showContent,
  isStretchedVertically,
  contentHeader,
  contentSubHeader,

  showCalendarNavigation,
  calendarBtnNextHandler,
  calendarBtnPrevHandler,
  nextButtonDisabled,
  prevButtonDisabled,

  contentFilter,
  tagFilter,
  contentCol,
  additionalContentCol,
  disableLoadingState,
  modals,
}) {
  const { t } = useTranslation();
  if (!showContent) return;
  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: [
          "dashboardHomePageContainer",
          isStretchedVertically && "stretchVertically",
        ],
      })}
    >
      <div
        className={classNameFormatter({
          styles,
          classNames: ["dashboardInfoContainer"],
        })}
      >
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            {contentHeader && <h3>{contentHeader}</h3>}
            {tagFilter && tagFilter}
            {contentSubHeader && <h6>{contentSubHeader}</h6>}
          </div>
          <div>{contentFilter && contentFilter}</div>
        </div>
        {showCalendarNavigation && (
          <div className={styles.calendardNavigationButtons}>
            <Button
              label={t("buttons.previousWeek")}
              onClick={calendarBtnPrevHandler}
              disabled={prevButtonDisabled}
            />

            <Button
              label={t("buttons.nextWeek")}
              onClick={calendarBtnNextHandler}
              disabled={nextButtonDisabled}
            />
          </div>
        )}
        {contentCol}
      </div>
      {additionalContentCol && (
        <div className={styles.dashboardInfoContainer}>
          {additionalContentCol}
        </div>
      )}
      {modals &&
        modals.map(
          (modal, i) =>
            modal.showModal && (
              <ModalWindowMain
                key={i}
                modalType={modal.modalType}
                data={modal.data}
                onSubmit={modal.onSubmit}
                onDeleteSubmit={modal.onDeleteSubmit}
                onCancel={modal.onCancel}
                disableBlur={modal.disableBlur}
              />
            )
        )}
      {<LoadingState fadeOut={showContent} inactive={disableLoadingState} />}
    </div>
  );
}

DashboardContentContainer.propTypes = {
  columnCount: PropTypes.number,
  contentCol: PropTypes.any,
  additionalContentCol: PropTypes.any,
  showContent: PropTypes.bool,
  disableLoadingState: PropTypes.bool,
  modals: PropTypes.array,
  isStretchedVertically: PropTypes.bool,
  contentHeader: PropTypes.string,
  contentSubHeader: PropTypes.string,
  contentFilter: PropTypes.element,
  tagFilter: PropTypes.element,
  showCalendarNavigation: PropTypes.bool,
  calendarBtnNextHandler: PropTypes.func,
  calendarBtnPrevHandler: PropTypes.func,
  nextButtonDisabled: PropTypes.bool,
  prevButtonDisabled: PropTypes.bool,
};
