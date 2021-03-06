import * as _ from "lodash"

import { getCalendar } from "~/src/server/lib/loader-module-helpers/services/google-calendar"
import {
  SettingValueValidationBase,
  ResDataForValidation,
} from "../../../base/setting-value-validation-base"
import { GoogleCalendarInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { GoogleCalendar } from "~/src/common/setting-value-validation/validate"
import { GoogleCalendar as ValidationObjects } from "~/src/common/setting-value-validation/validation-object"

// Types
import { GoogleCalendarSettingValue } from "~/src/common/types/common/setting-value"

export class GoogleCalendarSettingValueValidation extends SettingValueValidationBase<GoogleCalendarSettingValue> {
  access_token:string
  calendar_id:string
  constructor(access_token:string, setting_value:any) {
    super(setting_value)
    this.calendar_id = this.setting_value.id
    /**
     * 2020-06-21 09:25 
     * 
     * Not considering `summary` when validating.
     * 
     * But still accepting the whole object because all the others do too.
     */
    // this.calendar_summary = this.setting_value.summary
    this.access_token = access_token
  }

  async getSettingValueData() {
    return await getCalendar(this.access_token, this.calendar_id)
  }

  convertErrorToInvalidReason(error:any) {
    /**
     * 404 error response with:
     * 
     * error.errors[0]: {
     *   reason: "notFound",
     *   message: "Not Found"
     * }
     */
    if(_.get(error, "response.status") == 404) {
      if(_.get(error, "response.data.error.errors[0]reason") == "notFound") {
        return ValidationObjects.CALENDAR_NOT_FOUND()
      }
    }
  }

  preValidate() {
    return GoogleCalendar.validate(this.setting_value)
  }
}