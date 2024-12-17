import { useEffect, useState } from "react";
import InputElement from "../../../components/elements/inputElement/inputElement";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import styles from "./registerForm.module.scss";
import LoadingState from "../../../components/loadingState/loadingState";
import {
  selectRegisterPageLoaded,
  setRegisterPageLoaded,
} from "../../../store/loadStateSlice";
import {
  clearUserInfoError,
  registerUser,
  selectUserInfoCreationStatus,
  selectUserInfoErrorMessage,
  selectUserInfoErrorStatus,
  selectUserInfoLoadingStatus,
} from "../../../store/userInfoSlice";
import Button from "../../../components/elements/button/button";
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
} from "../../../utilities/regexUtilities";

export default function RegisterForm() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dataLoaded = useSelector(selectRegisterPageLoaded);

  const isLoading = useSelector(selectUserInfoLoadingStatus);
  const isUserCreated = useSelector(selectUserInfoCreationStatus);
  const hasError = useSelector(selectUserInfoErrorStatus);
  const errorMessage = useSelector(selectUserInfoErrorMessage);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserInfoError());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dataLoaded) return;
    setTimeout(() => {
      setShowRegisterForm(true);
      dispatch(setRegisterPageLoaded());
    }, 300);
  }, [dispatch, dataLoaded]);

  useEffect(() => {
    if (isUserCreated) {
      // navigate("/login");
    }
  }, [isUserCreated]);

  // function handleModalClick() {
  //   Navigate("/login");
  // }

  function handleSubmit(e) {
    e.preventDefault();
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    if (
      !isUsernameValid(username) ||
      !isEmailValid(email) ||
      !isPasswordValid(password)
    ) {
      !isUsernameValid(username) &&
        setUsernameError(t("loginRegisterForm.usernameError"));
      !isEmailValid(email) && setEmailError(t("loginRegisterForm.emailError"));
      !isPasswordValid(password) &&
        setPasswordError(t("loginRegisterForm.passwordError"));

      return;
    }

    dispatch(registerUser({ username, email, password }));
  }

  return (
    <div className={styles.mainContainer}>
      <form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
        <h4>{t("loginRegisterForm.register")}</h4>
        {!isUserCreated && (
          <div className={styles.inputsContainer}>
            {hasError && <p className={styles.errorMessage}>{errorMessage}</p>}
            <InputElement
              label={t("loginRegisterForm.email")}
              inputError={emailError}
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              width={100}
            />
            <InputElement
              label={t("loginRegisterForm.username")}
              inputError={usernameError}
              type="text"
              name="nickname"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              width={100}
            />
            <InputElement
              label={t("loginRegisterForm.password")}
              inputError={passwordError}
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              width={100}
            />

            <Button
              label={t("buttons.register")}
              style="greenBtn"
              isLoading={isLoading}
              loadingLabel={t("buttons.register")}
            />
          </div>
        )}
        {isUserCreated && (
          <div className={styles.finishRegistrationContainer}>
            <p>{t("loginRegisterForm.finishRegistration")}</p>
          </div>
        )}
      </form>

      <LoadingState fadeOut={showRegisterForm} inactive={dataLoaded} />
    </div>
  );
}
