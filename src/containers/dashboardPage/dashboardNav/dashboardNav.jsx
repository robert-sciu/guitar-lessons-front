import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "../../../../config/i18n";
import { NavLink, Outlet } from "react-router-dom";

export default function DashboardNav() {
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
              <NavLink>{t("dashboardNav.calendar")}</NavLink>
            </li>
            <li>
              <NavLink>{t("dashboardNav.payments")}</NavLink>
            </li>
          </ul>
        </I18nextProvider>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
