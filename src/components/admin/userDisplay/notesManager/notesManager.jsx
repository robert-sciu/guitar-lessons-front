import { updateUser } from "../../../../store/admin/adminUserInfoSlice";
import ConfigurableUserInput from "../../../elements/configurableUserInput/configurableUserInput";
import UserSectionDisplay from "../userManagementDisplay/userSectionDisplay";

import PropTypes from "prop-types";

export default function NotesManager({ user }) {
  return (
    <UserSectionDisplay columns={1}>
      <ConfigurableUserInput
        userId={user.id}
        controllerType={"textarea"}
        label={"notes"}
        isFlexColumn={true}
        showSpinner={true}
        statusChangeHandler={updateUser}
        valueToUpdate={"user_notes"}
        adjustableValueCurrent={user.user_notes}
      />
    </UserSectionDisplay>
  );
}

NotesManager.propTypes = {
  user: PropTypes.object,
};
