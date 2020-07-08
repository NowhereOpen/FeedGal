import { GoogleCalendarInvalidReason } from "~/src/common/types/common/setting-value-validation"

export const NO_CALENDAR = () => <GoogleCalendarInvalidReason> {
  name: "NO_CALENDAR",
  message: "Please choose a calendar."
}

export const CALENDAR_NOT_FOUND = () => <GoogleCalendarInvalidReason> {
  name: "CALENDAR_NOT_FOUND",
  message: "Calendar id was not found"
}