import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "../../../../config/i18n";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectIsAuthenticated } from "../../../store/authSlice";
import { useEffect } from "react";

export default function DashboardNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  });
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <I18nextProvider i18n={i18n}>
          <ul>
            <li>
              <NavLink to="/dashboard">{t("dashboardNav.home")}</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/tasks">{t("dashboardNav.tasks")}</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/availableTasks">
                {t("dashboardNav.availableTasks")}
              </NavLink>
            </li>
            <li>
              <NavLink>{t("dashboardNav.completedTasks")}</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/calendar">
                {t("dashboardNav.calendar")}
              </NavLink>
            </li>
            <li>
              <NavLink>{t("dashboardNav.payments")}</NavLink>
            </li>
            <button onClick={handleLogout}>{t("dashboardNav.logout")}</button>
          </ul>
        </I18nextProvider>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
