import { GoogleCalendarInvalidReason } from "~/src/common/types/common/setting-value-validation"
import { GoogleCalendarSettingValue } from "~/src/common/types/common/setting-value"
import { NO_CALENDAR } from "../../validation-object/google-calendar"
import { getInvalidReason } from "../utility"

export function validateCalendarNotEmpty(value:GoogleCalendarSettingValue):GoogleCalendarInvalidReason|undefined {
  /**
   * 2020-07-07 17:06
   * 
   * Just as a note, creating a new calendar in the google calendar app does not
   * allow an empty calendar name. Calendar name is the `.summary` property.
   */
  if(value.id.trim() == "" || value.summary.trim() == "") {
    return NO_CALENDAR()
  }
}

export function validate(new_value:GoogleCalendarSettingValue):GoogleCalendarInvalidReason|undefined {
  const invalid_reason:GoogleCalendarInvalidReason|undefined = getInvalidReason<GoogleCalendarInvalidReason, GoogleCalendarSettingValue>([validateCalendarNotEmpty], new_value)
  return invalid_reason
}