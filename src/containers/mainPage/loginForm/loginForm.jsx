import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  loginUser,
  selectIsAuthenticated,
  selectIsLoading,
} from "../../../store/authSlice";

import i18n from "../../../../config/i18n";
import { useTranslation, I18nextProvider } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedIn = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    } else {
      setShowLogin(true);
    }
  }, [loggedIn, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      !email && setEmailError(t("loginForm.emailError"));
      !password && setPasswordError(t("loginForm.passwordError"));
    } else {
      setEmailError("");
      setPasswordError("");
    }
    dispatch(loginUser({ email, password }));
  }
  return (
    <div>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        showLogin && (
          <I18nextProvider i18n={i18n}>
            <form onSubmit={handleSubmit}>
              <h2>{i18n.t("loginForm.login")}</h2>
              <div>
                <label>{i18n.t("loginForm.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p>{emailError}</p>}
                <label>{i18n.t("loginForm.password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}
                <button type="submit">{i18n.t("loginForm.submitBtn")}</button>
              </div>
            </form>
          </I18nextProvider>
        )
      )}
    </div>
  );
}
