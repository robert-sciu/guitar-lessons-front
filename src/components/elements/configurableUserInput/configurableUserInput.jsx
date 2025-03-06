import { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import StatusLight from "../statusLight/statusLight";
import styles from "./configurableUserInput.module.scss";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";
import { debounce } from "lodash";
import LoadingState from "../../loadingState/loadingState";
import { classNameFormatter } from "../../../utilities/utilities";

export default function ConfigurableUserInput({
  controllerType,
  label,
  userId,
  isFlexColumn = false,

  labelOnlyValue,

  showStatusLight = false,
  statusLightIsActive,
  statusChangeHandler,
  valueToUpdate,
  showSpinner = false,

  greenBtnLabel,
  showGreenBtn = false,
  disableGreenBtn = false,
  redBtnLabel,
  showRedBtn = false,
  lockRedBtn,
  redBtnUnlockCode,

  adjustableValueCurrent,
  showAdjustableValue = false,
}) {
  const [unlockRedBtn, setUnlockRedBtn] = useState(false);
  const [unlockRedBtnInput, setUnlockRedBtnInput] = useState("");

  const [adjustableValue, setAdjustableValue] = useState(
    adjustableValueCurrent
  );
  const [savingValue, setSavingValue] = useState(false);
  console.log(savingValue);
  const dispatch = useDispatch();

  useEffect(() => {
    if (unlockRedBtnInput === redBtnUnlockCode) {
      setUnlockRedBtn(true);
    }
  }, [unlockRedBtnInput, redBtnUnlockCode]);

  function clearInputs() {
    setUnlockRedBtn(false);
    setUnlockRedBtnInput("");
    // setSavingValue(false);
    setAdjustableValue(0);
  }

  function handleButtonClick(status) {
    clearInputs();
    dispatch(statusChangeHandler({ id: userId, [valueToUpdate]: status }));
  }

  const debauncedSaveAdjustableValue = useRef(
    debounce((value) => {
      dispatch(statusChangeHandler({ id: userId, [valueToUpdate]: value }));
      setSavingValue(false);
    }, 1000)
  ).current;

  function handleValueAdjustment(value) {
    if (Number(value) && value < 1) return;
    setSavingValue(true);
    clearInputs();
    setAdjustableValue(value);
    debauncedSaveAdjustableValue(value);
  }

  function handleValueAdjustmentWithoutSaving(value) {
    setAdjustableValue(value);
  }

  return (
    <div
      className={classNameFormatter({
        styles,
        classNames: ["mainContainer", isFlexColumn && "flexColumn"],
      })}
    >
      <div className={styles.labelContainer}>
        {<p>{label}</p>}
        {showStatusLight && <StatusLight isActive={statusLightIsActive} />}
        {showAdjustableValue && <p>{adjustableValue}</p>}
        {showSpinner && (
          <LoadingState spinnerOnly={true} inactive={!savingValue} />
        )}
      </div>

      <div
        className={classNameFormatter({
          styles,
          classNames: [controllerType === "textarea" && "textareaContainer"],
        })}
      >
        {controllerType === "enable-disable" && (
          <>
            {showGreenBtn && (
              <Button
                label={greenBtnLabel}
                style="greenBtn"
                disabled={!showGreenBtn || disableGreenBtn}
                onClick={() => handleButtonClick(true)}
              />
            )}
            {lockRedBtn && !unlockRedBtn && !showGreenBtn && (
              <input
                placeholder={`type ${redBtnUnlockCode}`}
                value={unlockRedBtnInput}
                onChange={(e) => setUnlockRedBtnInput(e.target.value)}
              />
            )}
            {showRedBtn && unlockRedBtn && (
              <Button
                label={redBtnLabel}
                style="redBtn"
                disabled={!showRedBtn}
                onClick={() => handleButtonClick(false)}
              />
            )}
          </>
        )}
        {controllerType === "increase-decrease" && (
          <div className={styles.adjustButtonsContainer}>
            <Button
              label={"-"}
              onClick={() => handleValueAdjustment(adjustableValue - 1)}
              style={"smallBtn"}
            />
            <Button
              label={"+"}
              onClick={() => handleValueAdjustment(adjustableValue + 1)}
              style={"smallBtn"}
            />
          </div>
        )}
        {controllerType === "only-label" && <p>{labelOnlyValue}</p>}
        {controllerType === "number-input" && (
          <div className={styles.numberInputContainer}>
            <input
              type="number"
              value={adjustableValue}
              onChange={(e) =>
                handleValueAdjustmentWithoutSaving(e.target.value)
              }
            />

            <Button
              label={greenBtnLabel}
              style="greenBtn"
              // disabled={!showGreenBtn || disableGreenBtn}
              onClick={() => handleButtonClick(adjustableValue)}
            />
          </div>
        )}
        {controllerType === "textarea" && (
          <textarea
            className={styles.textarea}
            value={adjustableValue || ""}
            onChange={(e) => handleValueAdjustment(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

ConfigurableUserInput.propTypes = {
  controllerType: PropTypes.string,
  label: PropTypes.string,
  showStatusLight: PropTypes.bool,
  statusLightIsActive: PropTypes.bool,
  showGreenBtn: PropTypes.bool,
  greenBtnLabel: PropTypes.string,
  showRedBtn: PropTypes.bool,
  redBtnLabel: PropTypes.string,
  lockRedBtn: PropTypes.bool,
  redBtnUnlockCode: PropTypes.string,
  statusChangeHandler: PropTypes.func,
  valueToUpdate: PropTypes.string,
  userId: PropTypes.number,
  hideLabel: PropTypes.bool,
  showAdjustableValue: PropTypes.bool,
  showSpinner: PropTypes.bool,
  savingValue: PropTypes.bool,
  disableGreenBtn: PropTypes.bool,
  adjustableValue: PropTypes.number,
  labelOnlyValue: PropTypes.any,
  showAdminLink: PropTypes.bool,
  adjustableValueCurrent: PropTypes.any,
  isFlexColumn: PropTypes.bool,
};
