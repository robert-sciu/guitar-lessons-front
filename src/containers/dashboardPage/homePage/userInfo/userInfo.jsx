import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import InputToggler from "../../../../components/elements/inputToggler/inputToggler";
import ModalWindowMain from "../../../../components/modalWindows/modalWindow/modalWindowMain";
import Button from "../../../../components/elements/button/button";
import { HiOutlinePencilSquare } from "react-icons/hi2";

import {
  selectEmailChangeConfirmationCodeRequired,
  updateEmail,
  updateUserMailCodeRequest,
  updateUser,
  cancelEmailChange,
  clearUserInfoError,
  selectUserInfoErrorStatus,
  selectUserInfoErrorMessage,
  selectUserInfoLoadingStatus,
} from "../../../../store/userInfoSlice";

import styles from "./userInfo.module.scss";
import PropTypes from "prop-types";
import InfoTile from "../infoTile/infoTile";

export default function UserInfo({ userInfo }) {
  const [usernameEditMode, setUsernameEditMode] = useState(false);
  const [username, setUsername] = useState(userInfo.username);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [email, setEmail] = useState("");

  const userInfoHasError = useSelector(selectUserInfoErrorStatus);

  const userInfoError = useSelector(selectUserInfoErrorMessage);
  const emailChangeConfirmationCodeRequired = useSelector(
    selectEmailChangeConfirmationCodeRequired
  );
  const userInfoIsLoading = useSelector(selectUserInfoLoadingStatus);

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
    <div className={styles.mainContainer}>
      <h4>{t("userInfo.basicInfo")}</h4>
      <div className={styles.detailsContainer}>
        <InfoTile
          label={t("userInfo.profileStatus")}
          content={
            userInfo.is_confirmed_by_admin
              ? t("userInfo.active")
              : t("userInfo.inactive")
          }
          contentClassNames={
            userInfo.is_confirmed_by_admin ? ["active"] : ["inactive"]
          }
        />
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
            <Button
              label={t("buttons.edit")}
              isActive={usernameEditMode}
              activeLabel={t("buttons.save")}
              icon={<HiOutlinePencilSquare />}
              onClick={handleEditUsernameBtnClick}
              isLoading={username !== userInfo.username && userInfoIsLoading}
              loadingLabel={t("buttons.wait")}
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

            <Button
              label={t("buttons.edit")}
              isActive={emailEditMode}
              activeLabel={t("buttons.save")}
              icon={<HiOutlinePencilSquare />}
              onClick={handleEditEmailBtnClick}
              isLoading={email !== userInfo.email && userInfoIsLoading}
              loadingLabel={t("buttons.wait")}
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
      {userInfoHasError && (
        <ModalWindowMain
          modalType="error"
          data={userInfoError}
          onCancel={clearUserInfoError}
        />
      )}
    </div>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.object,
};
