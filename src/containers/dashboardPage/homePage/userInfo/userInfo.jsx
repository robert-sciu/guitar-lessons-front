import { useTranslation } from "react-i18next";
import styles from "./userInfo.module.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelEmailChange,
  selectEmailChangeConfirmationCodeRequired,
  selectEmailChangeResponse,
  selectUserInfoHasError,
  selectUserInfoIsLoading,
  updateEmail,
  updateUserMailCodeRequest,
  updateUser,
} from "../../../../store/userInfoSlice";
import CodeRequiredModal from "../../../../components/modalWindows/codeRequiredModal/codeRequiredModal";
import EditButton from "../../../../components/elements/editButton/editButton";
import InputToggler from "../../../../components/elements/inputToggler/inputToggler";

export default function UserInfo({ userInfo }) {
  const [showModal, setShowModal] = useState(false);
  const [usernameEditMode, setUsernameEditMode] = useState(false);
  const [username, setUsername] = useState(userInfo.username);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [email, setEmail] = useState(userInfo.email);
  const [confirmationCode, setConfirmationCode] = useState("");

  const userInfoHasError = useSelector(selectUserInfoHasError);

  const emailChangeConfirmationCodeRequired = useSelector(
    selectEmailChangeConfirmationCodeRequired
  );
  const emailChangeResponse = useSelector(selectEmailChangeResponse);

  const userInfoIsLoading = useSelector(selectUserInfoIsLoading);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!usernameEditMode && username !== userInfo.username) {
      const data = {
        username,
        id: userInfo.id,
      };
      dispatch(updateUser(data));
    }
  }, [usernameEditMode, username, userInfo.username, userInfo.id, dispatch]);

  useEffect(() => {
    if (!emailEditMode && email !== userInfo.email) {
      dispatch(updateUserMailCodeRequest({ email }));
    }
  }, [emailEditMode, email, userInfo.email, dispatch]);

  useEffect(() => {
    if (userInfoHasError) {
      setEmail(userInfo.email);
      setUsername(userInfo.username);
    }
  }, [userInfoHasError, userInfo.email, userInfo.username]);

  useEffect(() => {
    if (emailChangeConfirmationCodeRequired && !userInfoHasError) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [emailChangeConfirmationCodeRequired, userInfoHasError]);

  function handleSubmit(e) {
    e.preventDefault();
    if (confirmationCode) {
      dispatch(updateEmail({ change_email_token: confirmationCode }));
    }
  }

  function handleCancelCode() {
    setConfirmationCode("");
    setShowModal(false);
    setEmailEditMode(false);
    setEmail(userInfo.email);
    dispatch(cancelEmailChange());
  }

  return (
    <div className={styles.userInfoContainer}>
      <h4>{t("userInfo.basicInfo")}</h4>
      <div className={styles.detailsContainer}>
        <div className={styles.userData}>
          <p>{t("userInfo.profileStatus")}:</p>
          <div className={styles.userDataStatus}>
            {userInfo.is_confirmed ? (
              <p className={styles.active}>{t("userInfo.active")}</p>
            ) : (
              <p className={styles.inactive}>{t("userInfo.inactive")}</p>
            )}
          </div>
        </div>
        <div className={styles.userData}>
          <p>{t("userInfo.level")}:</p>
          <div className={styles.userDataStatus}>
            <div className={styles.level}>
              {userInfo.difficulty_clearance_level}
            </div>
          </div>
        </div>
        <div className={styles.userData}>
          <p>{t("userInfo.username")}:</p>
          <div className={styles.userDataStatus}>
            <InputToggler
              style={styles.inputToggler}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputIsActive={usernameEditMode}
            />
            <EditButton
              onClick={() => setUsernameEditMode(!usernameEditMode)}
              isLoading={username !== userInfo.username && userInfoIsLoading}
              isEditing={usernameEditMode}
            />
          </div>
        </div>
        <div className={styles.userData}>
          <p>{t("userInfo.email")}:</p>
          <div className={styles.userDataStatus}>
            <InputToggler
              style={styles.inputToggler}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputIsActive={emailEditMode}
            />
            <EditButton
              style={styles.editBtn}
              onClick={() => setEmailEditMode(!emailEditMode)}
              isLoading={email !== userInfo.email && userInfoIsLoading}
              isEditing={emailEditMode}
            />
          </div>
        </div>
      </div>
      <CodeRequiredModal
        onInput={(e) => setConfirmationCode(e.target.value)}
        onSubmit={handleSubmit}
        onCancel={handleCancelCode}
        showModal={showModal}
        isLoading={userInfoIsLoading}
        message={emailChangeResponse}
      />
    </div>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.object,
};
