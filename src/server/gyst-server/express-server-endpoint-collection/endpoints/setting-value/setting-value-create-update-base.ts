import _ from "lodash"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { RIOT_KEY_EXPIRED_ERROR } from "~/src/common/warning-error"

// Methods
import { validateSettingValue } from "~/src/server/method-collection/validate-setting-value"

// Models
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"

// Types
import { ValidationResult } from "~/src/common/types/pages/suite"

export abstract class SettingValueCreateUpdateBaseRequestHandler extends SessionRequestHandlerBase {
  /**
   * 2020-07-05 17:33
   * 
   * I think accepting only two primary variables is the best use-wise. Rest of the information can
   * be retrieved on the server side. Before, I accepted the whole 'service setting' data that includes
   * oauth and connected user info, thinking that retrieving properties from this data is better.
   * 
   * Not thinking about APIs for developers, but even from the API point of view, this is much
   * friendlier and easy to use.
   */
  // Included in the request
  service_setting_id!:string
  setting_value!:any

  // Retrieved on the server side
  service_id!:string
  oauth_connected_user_entry_id!:string|undefined

  async storeParams() {
    this.setting_value = this.req.body.setting_value
    this.service_setting_id = await this.getServiceSettingId()
    await this.loadServiceSetting()
  }

  abstract getServiceSettingId():string|Promise<string>

  async loadServiceSetting() {
    const service_setting = await service_setting_storage.getEntry(this.service_setting_id)!
    this.oauth_connected_user_entry_id = service_setting!.get("oauth_connected_user_entry_id")
    this.service_id = service_setting!.get("service_id")
  }

  async doTasks():Promise<void> {
    // Validate the value first
    let validation_result!:ValidationResult

    try {
      validation_result = await validateSettingValue(this.oauth_connected_user_entry_id, this.service_id, this.setting_value)
    }
    catch(e) {
      if(this.service_id == "league-of-legends" && _.get(e, "response.status") == 403) {
        /**
         * 2020-07-07 16:34
         * 
         * Not handling this inside the LoL validation file:
         * 
         *   - src/server/method-collection/common/services/collection/league-of-legends/lib/validate-setting-value.ts
         * 
         * this error has nothing to do with validation. We can't even validate because of this error.
         * 
         * 2020-07-04 13:42
         * 
         * Specific behavior for expired (mostly but 403 error is thrown when it's invalid as well)
         * api key.
         * 
         * This allows client side to print the error message while not invalidating the setting value.
         */
        this.res_data.validation_result = <ValidationResult> {
          is_valid: false,
          setting_value: null,
          invalid_reason: RIOT_KEY_EXPIRED_ERROR.message
        }
        return
      }
      
      throw e
    }

    /**
     * 2020-03-24 11:10
     * 
     * The setting value can be updated while validating. For example, LoL needs this because
     * "Hide on bush" and "Hi deo NBuSh" are treated as the same. Retrieving a consistent
     * setting value is required for checking duplicate setting value in the model.
     */
    const setting_value = validation_result.setting_value

    // Check duplicate
    if(validation_result.is_valid) {
      const is_duplicate = await setting_value_storage!.settingValueExists(this.service_setting_id, setting_value)
      if(is_duplicate) {
        validation_result.is_valid = false
        validation_result.invalid_reason = "Setting value already exists."
      }
    }

    if(validation_result.is_valid) {
      await this.updateModel(setting_value)
    }

    this.res_data.validation_result = validation_result
  }

  abstract updateModel(setting_value:any):Promise<any>
}