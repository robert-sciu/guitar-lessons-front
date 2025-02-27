import { useEffect, useRef, useState } from "react";
import Button from "../../../elements/button/button";
import LoadingState from "../../../loadingState/loadingState";
import StatusLight from "../statusLight/statusLight";
import styles from "./userDisplayUserInfoManagement.module.scss";

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../store/userInfoSlice";
import { debounce } from "lodash";
import { IoWarningSharp } from "react-icons/io5";
import { deleteUser } from "../../../../store/admin/adminUserInfoSlice";

export default function UserDisplayUserInfoManagement({ user }) {
  const [enableDelete, setEnableDelete] = useState(false);
  const [enableUnverify, setEnableUnverify] = useState(false);
  const [enableDeactivate, setEnableDeactivate] = useState(false);
  const [selectedClearanceLevel, setSelectedClearanceLevel] = useState(
    user.difficulty_clearance_level
  );
  const [savingClearanceLevel, setSavingClearanceLevel] = useState(false);

  const [enableDeleteInput, setEnableDeleteInput] = useState("");
  const [enableUnverifyInput, setEnableUnverifyInput] = useState("");
  const [enableDeactivateInput, setEnableDeactivateInput] = useState("");

  const dispatch = useDispatch();

  const debauncedSaveClearanceLevel = useRef(
    debounce((level, id) => {
      dispatch(updateUser({ id: id, difficulty_clearance_level: level }));
      setSavingClearanceLevel(false);
    }, 1000)
  ).current;

  useEffect(() => {
    if (enableDeleteInput === "enable-delete") {
      setEnableDelete(true);
    }
  }, [enableDeleteInput]);

  useEffect(() => {
    if (enableUnverifyInput === "enable-unverify") {
      setEnableUnverify(true);
    }
  }, [enableUnverifyInput]);

  useEffect(() => {
    if (enableDeactivateInput === "enable-deactivate") {
      setEnableDeactivate(true);
    }
  }, [enableDeactivateInput]);

  function clearInputs() {
    setEnableDelete(false);
    setEnableDeleteInput("");
    setEnableUnverify(false);
    setEnableUnverifyInput("");
    setEnableDeactivate(false);
    setEnableDeactivateInput("");
  }

  function handleSetVerificationSatus(status) {
    clearInputs();
    dispatch(updateUser({ id: user.id, is_verified: status }));
  }

  function handleSetActivationSatus(status) {
    clearInputs();
    dispatch(updateUser({ id: user.id, is_active: status }));
  }

  function handleSetClearanceLevel(level) {
    if (level < 1) return;
    setSavingClearanceLevel(true);
    clearInputs();
    setSelectedClearanceLevel(level);
    debauncedSaveClearanceLevel(level, user.id);
  }

  function handleDeleteUser() {
    clearInputs();
    dispatch(deleteUser(user.id));
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.statusControlContainer}>
        <div className={styles.statusContainer}>
          <p>verification</p>
          <StatusLight isActive={user.is_verified} />
        </div>
        <div className={styles.buttonsContainer}>
          {!user.is_verified && (
            <Button
              label={"Weryfikuj"}
              style="greenBtn"
              disabled={user.is_verified}
              onClick={() => handleSetVerificationSatus(true)}
            />
          )}
          {user.is_verified && !enableUnverify && (
            <input
              placeholder="type: enable-unverify"
              value={enableUnverifyInput}
              onChange={(e) => setEnableUnverifyInput(e.target.value)}
            />
          )}
          {user.is_verified && enableUnverify && (
            <Button
              label={"Zablokuj"}
              style="redBtn"
              disabled={!user.is_verified}
              onClick={() => handleSetVerificationSatus(false)}
            />
          )}
        </div>
      </div>
      <div className={styles.statusControlContainer}>
        <div className={styles.statusContainer}>
          <p>activation</p>
          <StatusLight isActive={user.is_active} />
        </div>
        <div className={styles.buttonsContainer}>
          {!user.is_active && (
            <Button
              label={"Aktywuj"}
              style="greenBtn"
              disabled={user.is_active}
              onClick={() => handleSetActivationSatus(true)}
            />
          )}
          {user.is_active && !enableDeactivate && (
            <input
              placeholder="type: enable-deactivate"
              value={enableDeactivateInput}
              onChange={(e) => setEnableDeactivateInput(e.target.value)}
            />
          )}

          {user.is_active && enableDeactivate && (
            <Button
              label={"Dezaktywuj"}
              style="redBtn"
              disabled={!user.is_active}
              onClick={() => handleSetActivationSatus(false)}
            />
          )}
        </div>
      </div>
      <div className={styles.statusControlContainer}>
        <div className={styles.statusContainer}>
          <p>poziom: {selectedClearanceLevel}</p>{" "}
          <LoadingState spinnerOnly={true} inactive={!savingClearanceLevel} />
        </div>
        <div className={styles.levelButtonsContainer}>
          <Button
            label={"-"}
            onClick={() => handleSetClearanceLevel(selectedClearanceLevel - 1)}
            style={"smallBtn"}
          />
          <Button
            label={"+"}
            onClick={() => handleSetClearanceLevel(selectedClearanceLevel + 1)}
            style={"smallBtn"}
          />
        </div>
      </div>
      <div className={styles.statusControlContainer}>
        <div className={styles.statusContainer}>
          <p>usuwanie</p>
          <div className={styles.warningIcon}>
            <IoWarningSharp />
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          {!enableDelete && (
            <input
              placeholder="type: enable-delete"
              value={enableDeleteInput}
              onChange={(e) => setEnableDeleteInput(e.target.value)}
            />
          )}
          {enableDelete && (
            <Button label={"Usuń"} style="redBtn" onClick={handleDeleteUser} />
          )}
        </div>
      </div>
    </div>
  );
}

UserDisplayUserInfoManagement.propTypes = {
  user: PropTypes.object,
};
