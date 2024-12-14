import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

import {
  loginUser,
  selectAuthLoadingState,
  selectIsAuthenticated,
  selectIsVerified,
  selectToken,
  selectTokenVerificationStatus,
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

export default function LoginForm() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedIn = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoadingState);
  const tokenVerificationComplete = useSelector(selectTokenVerificationStatus);
  const dataLoaded = useSelector(selectLoginPageLoaded);
  const userVerified = useSelector(selectIsVerified);

  const token = useSelector(selectToken);

  useEffect(() => {
    if (!tokenVerificationComplete && token) return;
    if (loggedIn) {
      if (!userVerified) {
        navigate("/register");
        return;
      }
      navigate("/dashboard/welcome");
    } else {
      setTimeout(() => {
        setShowLogin(true);
        dispatch(setLoginPageLoaded());
      }, 300);
    }
  }, [
    loggedIn,
    isLoading,
    navigate,
    tokenVerificationComplete,
    dataLoaded,
    dispatch,
    token,
    userVerified,
  ]);

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width={100}
          />
          <InputElement
            label={t("loginRegisterForm.password")}
            inputError={passwordError}
            type="password"
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
      <LoadingState fadeOut={showLogin} inactive={dataLoaded} />
    </div>
  );
}
