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
  contentFilter,
  tagFilter,
  contentCol,
  additionalContentCol,
  disableLoadingState,
  modals,
}) {
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
          <div>
            {contentHeader && <h3>{contentHeader}</h3>}
            {tagFilter && tagFilter}
            {contentSubHeader && <h6>{contentSubHeader}</h6>}
          </div>
          <div>{contentFilter && contentFilter}</div>
        </div>
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
                onCancel={modal.onCancel}
              />
            )
        )}
      {<LoadingState fadeOut={showContent} inactive={disableLoadingState} />}
    </div>
  );
}

DashboardContentContainer.propTypes = {
  columnCount: PropTypes.number,
  contentCol: PropTypes.array || PropTypes.object,
  additionalContentCol: PropTypes.element,
  showContent: PropTypes.bool,
  disableLoadingState: PropTypes.bool,
  modals: PropTypes.array,
  isStretchedVertically: PropTypes.bool,
  contentHeader: PropTypes.string,
  contentSubHeader: PropTypes.string,
};
