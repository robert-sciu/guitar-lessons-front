import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  loginUser,
  selectIsAuthenticated,
  selectIsLoading,
} from "../../../store/authSlice";

import { useTranslation } from "react-i18next";

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
      navigate("/dashboard/welcome");
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
          <form onSubmit={handleSubmit}>
            <h2>{t("loginForm.login")}</h2>
            <div>
              <label>{t("loginForm.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p>{emailError}</p>}
              <label>{t("loginForm.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p>{passwordError}</p>}
              <button type="submit">{t("loginForm.submitBtn")}</button>
            </div>
          </form>
        )
      )}
    </div>
  );
}
