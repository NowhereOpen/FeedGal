import * as _ from "lodash"

import { getCalendar } from "~/src/lib/gyst-entries-helper/services/google-calendar"
import {
  SettingValueValidationOAuthBase,
  ResDataForValidation,
  ControlledError,
} from "~/src/gyst/server/base-class/service-module/setting-value-validation-base"
import { refreshTokenIfFail } from "~/src/gyst/server/lib/service-module-helper/refresh-token-if-fail"
import { getCredential } from "./get-credential"
import { service_setting_storage } from "~/src/models/gyst-suite-service-setting"

export class GoogleCalendarSettingValueValidation extends SettingValueValidationOAuthBase {
  getOAuthConnectedUserEntryIdImpl() {
    return service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
  }

  async getSettingValueData() {
    const oauth_connected_user_entry_id = await this.getOAuthConnectedUserEntryId()

    return await refreshTokenIfFail("google", oauth_connected_user_entry_id, async () => {
      const access_token = await getCredential(this.user_id)

      return await getCalendar(access_token, this.setting_value)
    })
  }

  getErrorMessage(error:any) {
    /**
     * 404 error response with:
     * 
     * error.errors[0]: {
     *   reason: "notFound",
     *   message: "Not Found"
     * }
     */
    if(_.get(error, "response.status") == "404") {
      if(_.get(error, "response.data.error.errors[0]reason") == "notFound") {
        return "Calendar id was not found"
      }
    }
  }

  preValidate() {
    if((<string>this.setting_value).trim() == "") {
      throw new ControlledError("Calendar id must not be empty.")
    }
  }
}