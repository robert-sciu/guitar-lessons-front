import { useState } from "react";
import Button from "../../../elements/button/button";
import styles from "./userDisplayMain.module.scss";

import propTypes from "prop-types";
import UserDisplayManagementPanel from "../userDisplayManagementPanel/userDisplayManagementPanel";
import StatusLight from "../statusLight/statusLight";

export default function UserDisplayMain({ user }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className={styles.userDisplayContainer}>
        <p>{user.username}</p>
        <p>{user.email}</p>
        <p>{user.role}</p>
        <p>lvl: {user.difficulty_clearance_level}</p>
        <div className={styles.statusContainer}>
          <p>verification</p>
          <StatusLight isActive={user.is_verified} />
        </div>
        <div className={styles.statusContainer}>
          <p>activation</p>
          <StatusLight isActive={user.is_active} />
        </div>

        <Button
          label={"Pokaż więcej"}
          isActive={showMore}
          activeLabel={"Pokaż mniej"}
          onClick={() => setShowMore(!showMore)}
          disabled={user.role === "admin"}
        />
        {showMore && <UserDisplayManagementPanel user={user} />}
      </div>
    </>
  );
}

UserDisplayMain.propTypes = {
  user: propTypes.object,
};
