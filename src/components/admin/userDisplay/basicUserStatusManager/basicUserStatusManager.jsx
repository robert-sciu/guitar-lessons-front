// import styles from "./basicUserStatusManager.module.scss";

import PropTypes from "prop-types";
import { updateUser } from "../../../../store/admin/adminUserInfoSlice";
import { deleteUser } from "../../../../store/admin/adminUserInfoSlice";
import ConfigurableUserInput from "../../../elements/configurableUserInput/configurableUserInput";
import UserSectionDisplay from "../userManagementDisplay/userSectionDisplay";

export default function BasicUserStatusManager({ user }) {
  return (
    // <div className={styles.mainContainer}>
    <UserSectionDisplay columns={4}>
      <ConfigurableUserInput
        controllerType={"enable-disable"}
        label={"verification"}
        showStatusLight={true}
        statusLightIsActive={user.is_verified}
        showGreenBtn={!user.is_verified}
        greenBtnLabel={"Verify"}
        showRedBtn={user.is_verified}
        redBtnLabel={"Unverify"}
        lockRedBtn={true}
        redBtnUnlockCode={"enable-unverify"}
        statusChangeHandler={updateUser}
        valueToUpdate={"is_verified"}
        userId={user.id}
      />
      <ConfigurableUserInput
        controllerType={"enable-disable"}
        label={"activation"}
        showStatusLight={true}
        statusLightIsActive={user.is_active}
        showGreenBtn={!user.is_active}
        greenBtnLabel={"Activate"}
        showRedBtn={user.is_active}
        redBtnLabel={"Deactivate"}
        lockRedBtn={true}
        redBtnUnlockCode={"enable-deactivate"}
        statusChangeHandler={updateUser}
        valueToUpdate={"is_active"}
        userId={user.id}
      />
      <ConfigurableUserInput
        controllerType={"increase-decrease"}
        label={"Level: "}
        userId={user.id}
        showSpinner={true}
        adjustableValueCurrent={user.difficulty_clearance_level}
        statusChangeHandler={updateUser}
        valueToUpdate={"difficulty_clearance_level"}
        showAdjustableValue={true}
      />
      <ConfigurableUserInput
        controllerType={"enable-disable"}
        label={"delete"}
        userId={user.id}
        showGreenBtn={false}
        showRedBtn={true}
        redBtnLabel={"delete"}
        statusChangeHandler={deleteUser}
        valueToUpdate={null}
        lockRedBtn={true}
        redBtnUnlockCode={"enable-delete"}
      />
    </UserSectionDisplay>
    // </div>
  );
}

BasicUserStatusManager.propTypes = {
  user: PropTypes.object,
};
