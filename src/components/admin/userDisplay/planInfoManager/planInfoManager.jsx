import { updatePlanInfo } from "../../../../store/admin/adminPlanInfoSlice";
import {
  addMinutesToIsoString,
  changeISOStringHour,
  configWorkingHours,
  getLocalHourFromIsoString,
  getTodayDate,
  localHourToIsoHour,
} from "../../../../utilities/calendarUtilities";
import ConfigurableUserInput from "../../../elements/configurableUserInput/configurableUserInput";
import UserSectionDisplay from "../userManagementDisplay/userSectionDisplay";

import config from "../../../../../config/config";

import PropTypes from "prop-types";
import { useState } from "react";

export default function PlanInfoManager({ planInfo }) {
  const [selectedTime, setSelectedTime] = useState(
    planInfo.permanent_reservation_start_hour_UTC
  );
  const [selectedDuration, setSelectedDuration] = useState(
    planInfo.permanent_reservation_lesson_duration
  );
  const [selectedWeekday, setSelectedWeekday] = useState(
    planInfo.has_permanent_reservation && [
      planInfo.permanent_reservation_weekday,
      config.availableWeekdays[planInfo.permanent_reservation_weekday],
    ]
  );

  const weekdays = Object.entries(config.availableWeekdays);
  const workingHours = configWorkingHours().availableHoursArray;
  const durations = config.availableReservationLengths;

  function dropdownSelectHandler({ value, type }) {
    type === "hour" && setSelectedTime(value);
    type === "duration" && setSelectedDuration(value);
    type === "weekday" && setSelectedWeekday(value);
  }
  function updatePermanentReservation() {
    const endHour = getLocalHourFromIsoString(
      addMinutesToIsoString(
        changeISOStringHour(getTodayDate(), selectedTime),
        selectedDuration
      )
    );
    return updatePlanInfo({
      id: planInfo.user_id,
      has_permanent_reservation: true,
      permanent_reservation_start_hour_UTC: localHourToIsoHour(selectedTime),
      permanent_reservation_end_hour_UTC: localHourToIsoHour(endHour),
      permanent_reservation_weekday: selectedWeekday[0],
      permanent_reservation_lesson_duration: selectedDuration,
    });
  }
  return (
    <UserSectionDisplay columns={4}>
      <ConfigurableUserInput
        controllerType={"enable-disable"}
        label={"permanent plan"}
        showStatusLight={true}
        statusLightIsActive={planInfo.has_permanent_reservation}
        statusChangeHandler={() => updatePermanentReservation()}
        valueToUpdate={"has_permanent_reservation"}
        greenBtnLabel={
          planInfo.has_permanent_reservation ? "Update" : "Activate"
        }
        showGreenBtn={true}
        disableGreenBtn={!selectedTime || !selectedDuration || !selectedWeekday}
        redBtnLabel={"Deactivate"}
        showRedBtn={planInfo.has_permanent_reservation}
      />

      <ConfigurableUserInput
        controllerType={"dropdown"}
        label={"hour"}
        dropdownType={"hour"}
        dropdownData={workingHours}
        dropdownSelectHandler={(value) =>
          dropdownSelectHandler({ value, type: "hour" })
        }
        dropdownSelectedValue={selectedTime}
      />

      <ConfigurableUserInput
        controllerType={"dropdown"}
        label={"duration"}
        dropdownType={"duration"}
        dropdownData={durations}
        dropdownSelectHandler={(value) =>
          dropdownSelectHandler({ value, type: "duration" })
        }
        dropdownSelectedValue={selectedDuration}
      />

      <ConfigurableUserInput
        controllerType={"dropdown"}
        label={"weekday"}
        dropdownType={"weekday"}
        dropdownData={weekdays}
        dropdownSelectHandler={(value) =>
          dropdownSelectHandler({ value, type: "weekday" })
        }
        dropdownSelectedValue={selectedWeekday}
      />
    </UserSectionDisplay>
  );
}

PlanInfoManager.propTypes = {
  planInfo: PropTypes.object,
};
