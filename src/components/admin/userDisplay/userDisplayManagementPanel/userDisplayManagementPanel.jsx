import styles from "./userDisplayManagementPanel.module.scss";
import PropTypes from "prop-types";

import UserDisplayUserInfoManagement from "../userDisplayUserInfoManagement/userDisplayUserInfoManagement";

export default function UserDisplayManagementPanel({ user }) {
  return (
    <div className={styles.mainContainer}>
      <UserDisplayUserInfoManagement user={user} />
    </div>
  );
}

UserDisplayManagementPanel.propTypes = {
  user: PropTypes.object,
};
