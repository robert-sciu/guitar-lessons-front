import { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import StatusLight from "../statusLight/statusLight";
import styles from "./configurableUserInput.module.scss";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";
import { debounce } from "lodash";
import LoadingState from "../../loadingState/loadingState";
import CustomDropdown from "../../modalWindows/customDropdown/customDropdown";

export default function ConfigurableUserInput({
  controllerType,
  label,
  userId,

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

  dropdownType,
  dropdownData,
  dropdownSelectedValue,
  dropdownSelectHandler,
}) {
  const [unlockRedBtn, setUnlockRedBtn] = useState(false);
  const [unlockRedBtnInput, setUnlockRedBtnInput] = useState("");

  const [adjustableValue, setAdjustableValue] = useState(
    adjustableValueCurrent
  );
  const [savingValue, setSavingValue] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (unlockRedBtnInput === redBtnUnlockCode) {
      setUnlockRedBtn(true);
    }
  }, [unlockRedBtnInput, redBtnUnlockCode]);

  function clearInputs() {
    setUnlockRedBtn(false);
    setUnlockRedBtnInput("");
  }

  function handleButtonClick(status) {
    clearInputs();
    dispatch(statusChangeHandler({ id: userId, [valueToUpdate]: status }));
  }

  const debauncedSaveAdjustableValue = useRef(
    debounce((level) => {
      dispatch(statusChangeHandler({ id: userId, [valueToUpdate]: level }));
      setSavingValue(false);
    }, 1000)
  ).current;

  function handleValueAdjustment(value) {
    if (value < 1) return;
    setSavingValue(true);
    clearInputs();
    setAdjustableValue(value);
    debauncedSaveAdjustableValue(value);
  }

  // function handleDropdownSelect(value) {
  // clearInputs();
  // dispatch(statusChangeHandler({ id: userId, [valueToUpdate]: value }));
  // console.log(value);
  // }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.labelContainer}>
        {<p>{label}</p>}
        {showStatusLight && <StatusLight isActive={statusLightIsActive} />}
        {showAdjustableValue && <p>{adjustableValue}</p>}
        {showSpinner && (
          <LoadingState spinnerOnly={true} inactive={!savingValue} />
        )}
      </div>
      <div className={styles.controllerContainer}>
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
        {controllerType === "dropdown" && (
          <CustomDropdown
            availableReservationHours={dropdownData}
            availableDurationValues={dropdownData}
            availableWeekdays={dropdownData}
            selectedValue={dropdownSelectedValue}
            onSelect={dropdownSelectHandler}
            type={dropdownType}
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
  showAdjustableValue: PropTypes.bool,
  adjustableValueCurrent: PropTypes.number,
  showSpinner: PropTypes.bool,
};
