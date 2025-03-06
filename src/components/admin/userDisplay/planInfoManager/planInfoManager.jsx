import ConfigurableUserInput from "../../../elements/configurableUserInput/configurableUserInput";
import UserSectionDisplay from "../userManagementDisplay/userSectionDisplay";

import PropTypes from "prop-types";
import { updatePlanInfo } from "../../../../store/admin/adminPlanInfoSlice";
import { calculatePayment } from "../../../../utilities/utilities";

export default function PlanInfoManager({ planInfo, pricingInfo }) {
  return (
    <>
      <UserSectionDisplay columns={3}>
        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Balance Count`}
          showStatusLight={true}
          statusLightIsActive={planInfo.lesson_balance >= 0}
          labelOnlyValue={planInfo.lesson_balance}
        />
        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Discount`}
          labelOnlyValue={`${planInfo.discount}%`}
        />
        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Balance PLN`}
          showStatusLight={true}
          statusLightIsActive={planInfo.lesson_balance >= 0}
          labelOnlyValue={
            planInfo &&
            pricingInfo[0] &&
            calculatePayment({ planInfo, pricingInfo })
          }
        />

        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Completed`}
          labelOnlyValue={planInfo.lesson_count}
        />

        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Rescheduled`}
          labelOnlyValue={planInfo.rescheduled_lesson_count}
        />
        <ConfigurableUserInput
          controllerType={"only-label"}
          label={`Cancelled`}
          labelOnlyValue={planInfo.cancelled_lesson_count}
        />
      </UserSectionDisplay>
      <UserSectionDisplay columns={2}>
        <ConfigurableUserInput
          userId={planInfo.user_id}
          controllerType={"number-input"}
          label={"Update Balance"}
          statusChangeHandler={updatePlanInfo}
          valueToUpdate={"lesson_balance"}
          greenBtnLabel={"Save"}
        />
        <ConfigurableUserInput
          userId={planInfo.user_id}
          controllerType={"number-input"}
          label={"Update Discount"}
          statusChangeHandler={updatePlanInfo}
          valueToUpdate={"discount"}
          greenBtnLabel={"Save"}
        />
      </UserSectionDisplay>
    </>
  );
}

PlanInfoManager.propTypes = {
  planInfo: PropTypes.object,
  pricingInfo: PropTypes.array,
};
