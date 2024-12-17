import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activateUserWithToken,
  selectUserInfoActivationStatus,
  selectUserInfoErrorStatus,
  selectUserInfoLoadingStatus,
} from "../../../store/userInfoSlice";
import LoadingState from "../../../components/loadingState/loadingState";
import { useNavigate } from "react-router-dom";

export default function ActivationPage() {
  const urlToken = new URLSearchParams(window.location.search).get("token");
  const activationSuccess = useSelector(selectUserInfoActivationStatus);
  const isLoading = useSelector(selectUserInfoLoadingStatus);
  const hasError = useSelector(selectUserInfoErrorStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!urlToken) {
      navigate("/");
    }
    if (!isLoading && !hasError && !activationSuccess && urlToken) {
      dispatch(activateUserWithToken({ token: urlToken }));
    }
  }, [urlToken, isLoading, hasError, activationSuccess, dispatch, navigate]);
  return (
    <div>
      {isLoading && <LoadingState />}
      {activationSuccess && <p>Account successfully activated</p>}
      {hasError && <p>Something went wrong</p>}
    </div>
  );
}
