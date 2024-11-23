import { useTranslation } from "react-i18next";
import styles from "./userInfo.module.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // cancelEmailChange,
  selectEmailChangeConfirmationCodeRequired,
  // selectEmailChangeResponse,
  selectUserInfoHasError,
  selectUserInfoIsLoading,
  updateEmail,
  updateUserMailCodeRequest,
  updateUser,
  cancelEmailChange,
} from "../../../../store/userInfoSlice";
// import CodeRequiredModal from "../../../../components/modalWindows/codeRequiredModal/codeRequiredModal";
import EditButton from "../../../../components/elements/editButton/editButton";
import InputToggler from "../../../../components/elements/inputToggler/inputToggler";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";

export default function UserInfo({ userInfo }) {
  const [usernameEditMode, setUsernameEditMode] = useState(false);
  const [username, setUsername] = useState(userInfo.username);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [email, setEmail] = useState("");

  const userInfoHasError = useSelector(selectUserInfoHasError);
  const emailChangeConfirmationCodeRequired = useSelector(
    selectEmailChangeConfirmationCodeRequired
  );
  const userInfoIsLoading = useSelector(selectUserInfoIsLoading);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!emailChangeConfirmationCodeRequired) {
      setEmail(userInfo.email);
    }
  }, [emailChangeConfirmationCodeRequired, userInfo.email]);

  useEffect(() => {
    if (userInfoHasError) {
      setEmail(userInfo.email);
      setUsername(userInfo.username);
    }
  }, [userInfoHasError, userInfo.email, userInfo.username]);

  function handleEditUsernameBtnClick() {
    setUsernameEditMode(!usernameEditMode);
    if (username !== userInfo.username) {
      const data = {
        username,
        id: userInfo.id,
      };
      dispatch(updateUser(data));
    }
  }

  function handleEditEmailBtnClick() {
    setEmailEditMode(!emailEditMode);
    if (email !== userInfo.email) {
      dispatch(updateUserMailCodeRequest({ email }));
    }
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
              onClick={handleEditUsernameBtnClick}
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
              onClick={handleEditEmailBtnClick}
              isLoading={email !== userInfo.email && userInfoIsLoading}
              isEditing={emailEditMode}
            />
          </div>
        </div>
      </div>
      {emailChangeConfirmationCodeRequired && (
        <ModalWindowMain
          modalType={"codeRequired"}
          onSubmit={updateEmail}
          onCancel={cancelEmailChange}
        />
      )}
    </div>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.object,
};
