import { useTranslation } from "react-i18next";
import styles from "./mainNav.module.scss";
import { NavLink, Outlet } from "react-router-dom";

export default function MainNav() {
  const { t } = useTranslation();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.navContainer}>
        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/">{t("mainNav.home")}</NavLink>
          </li>
          <li>
            <NavLink to="/login">{t("mainNav.login")}</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.outletContainer}>
        <Outlet />
      </div>
    </div>
  );
}
