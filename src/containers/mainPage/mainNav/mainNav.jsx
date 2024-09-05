import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "../../../../config/i18n";

import { NavLink, Outlet } from "react-router-dom";

export default function MainNav() {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <I18nextProvider i18n={i18n}>
          <ul>
            <li>
              <NavLink to="/">{t("mainNav.home")}</NavLink>
            </li>
            <li>
              <NavLink to="/login">{t("mainNav.login")}</NavLink>
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
