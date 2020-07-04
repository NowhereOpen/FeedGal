import _ from "lodash"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { RIOT_KEY_EXPIRED_ERROR } from "~/src/common/warning-error"

// Methods
import { validateSettingValue } from "~/src/server/method-collection/validate-setting-value"

// Models
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Types
import { ServiceSetting, ValidationResult } from "~/src/common/types/pages/suite"

export abstract class SettingValueCreateUpdateBaseRequestHandler extends SessionRequestHandlerBase {
  service_id!:string
  service_setting!:ServiceSetting
  service_setting_id!:string

  setting_value!:any

  storeParams():void|Promise<void> {    
    this.service_setting = this.req.body.service_setting
    this.service_id = this.service_setting.service_id
    this.service_setting_id = this.service_setting._id

    this.setting_value = this.req.body.setting_value
  }

  async doTasks():Promise<void> {
    // Validate the value first
    let validation_result!:ValidationResult

    try {
      validation_result = await validateSettingValue(this.service_setting, this.setting_value)
    }
    catch(e) {
      if(e) {
        if(this.service_id == "league-of-legends" && _.get(e, "response.status") == 403) {
          /**
           * 2020-07-04 13:42
           * 
           * Specific behavior for expired (mostly but 403 error is thrown when it's invalid as well)
           * api key.
           * 
           * This allows client side to print the error message while not invalidating the setting value.
           */
          this.res_data = <ValidationResult> {
            is_valid: false,
            setting_value: null,
            invalid_reason: RIOT_KEY_EXPIRED_ERROR.message
          }
          return
        }
      }
      else {
        throw e
      }
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

    this.res_data = validation_result
  }

  abstract updateModel(setting_value:any):Promise<any>
}