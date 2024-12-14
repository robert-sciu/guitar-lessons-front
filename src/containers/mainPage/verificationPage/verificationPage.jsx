import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserInfoErrorMessage,
  selectUserInfoErrorStatus,
  selectUserInfoVerificationStatus,
  verifyUser,
} from "../../../store/userInfoSlice";
import { Link, useNavigate } from "react-router-dom";
import LoadingState from "../../../components/loadingState/loadingState";
import { useTranslation } from "react-i18next";
import ModalWindowMain from "../../../components/modalWindows/modalWindow/modalWindowMain";

export default function VerificationPage() {
  const [secondsToRedirection, setSecondsToRedirection] = useState(5);

  const urlToken = new URLSearchParams(window.location.search).get("token");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const hasError = useSelector(selectUserInfoErrorStatus);
  const errorMessage = useSelector(selectUserInfoErrorMessage);
  const userIsVerified = useSelector(selectUserInfoVerificationStatus);

  useEffect(() => {
    if (urlToken) {
      dispatch(verifyUser({ token: urlToken }));
    } else {
      navigate("/register");
    }
  }, [urlToken, dispatch, navigate]);

  function navigateToLogin() {
    navigate("/login");
  }

  useEffect(() => {
    if (userIsVerified) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [userIsVerified, navigate]);

  useEffect(() => {
    function countDown() {
      if (secondsToRedirection > 0) {
        setTimeout(() => {
          setSecondsToRedirection((prev) => prev - 1);
        }, 1000);
      }
    }
    countDown();
  }, [secondsToRedirection]);

  return (
    <div>
      {userIsVerified && (
        <div>
          <p>{t("loginRegisterForm.verificationSuccess")}</p>
          <p>
            {t("loginRegisterForm.redirectToLogin")}: {secondsToRedirection}
          </p>
          <Link to="/login">{t("loginRegisterForm.goToLogin")}</Link>
        </div>
      )}
      {hasError && (
        <ModalWindowMain
          modalType="error"
          data={errorMessage + ". " + t("loginRegisterForm.contactUs") + "."}
          onCancel={navigateToLogin}
        />
      )}
      <LoadingState fadeOut={userIsVerified || hasError} fullscreen={true} />
    </div>
  );
}
