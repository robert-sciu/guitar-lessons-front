import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

import {
  clearAuthError,
  loginUser,
  selectAuthAuthenticationStatus,
  selectAuthErrorMessage,
  selectAuthErrorStatus,
  // selectAuthLoadingState,
  selectAuthToken,
  selectAuthTokenVerificationStatus,
} from "../../../store/authSlice";

import { useTranslation } from "react-i18next";
import LoadingState from "../../../components/loadingState/loadingState";
import styles from "./loginForm.module.scss";
import InputElement from "../../../components/elements/inputElement/inputElement";
import {
  selectLoginPageLoaded,
  setLoginPageLoaded,
} from "../../../store/loadStateSlice";
import Button from "../../../components/elements/button/button";
import {
  isEmailValid,
  isPasswordValid,
} from "../../../utilities/regexUtilities";
import ModalWindowMain from "../../../components/modalWindows/modalWindow/modalWindowMain";

export default function LoginForm() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedIn = useSelector(selectAuthAuthenticationStatus);
  // const isLoading = useSelector(selectAuthLoadingState);
  const tokenVerificationComplete = useSelector(
    selectAuthTokenVerificationStatus
  );
  const dataLoaded = useSelector(selectLoginPageLoaded);
  const hasError = useSelector(selectAuthErrorStatus);
  const errorMessage = useSelector(selectAuthErrorMessage);

  const token = useSelector(selectAuthToken);

  useEffect(() => {
    if (!tokenVerificationComplete && token) return;
    if (loggedIn) {
      navigate("/dashboard/welcome");
    } else {
      setTimeout(() => {
        setShowLogin(true);
        dispatch(setLoginPageLoaded());
      }, 300);
    }
  }, [loggedIn, tokenVerificationComplete, token, navigate, dispatch]);

  function handleSubmit(e) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    if (!isEmailValid(email) || !isPasswordValid(password)) {
      !isEmailValid(email) && setEmailError(t("loginRegisterForm.emailError"));
      !isPasswordValid(password) &&
        setPasswordError(t("loginRegisterForm.passwordError"));
      return;
    }
    dispatch(loginUser({ email, password }));
  }

  return (
    <div className={styles.mainContainer}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h4>{t("loginRegisterForm.login")}</h4>
        <div className={styles.inputsContainer}>
          <InputElement
            label={t("loginRegisterForm.email")}
            inputError={emailError}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width={100}
          />
          <InputElement
            label={t("loginRegisterForm.password")}
            inputError={passwordError}
            type="password"
            name="password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width={100}
          />
          <Button label={t("loginRegisterForm.submitBtn")} style={"greenBtn"} />

          <p>
            {t("loginRegisterForm.notMemberYet")}{" "}
            <Link to="/register">{t("loginRegisterForm.register")}</Link>
          </p>
        </div>
      </form>
      {hasError && (
        <ModalWindowMain
          modalType={"error"}
          data={errorMessage}
          onCancel={clearAuthError}
        />
      )}

      <LoadingState fadeOut={showLogin} inactive={dataLoaded} />
    </div>
  );
}
