import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import {
  SettingValueValidationBase
} from "~/src/gyst/server/base-class/service-module/setting-value-validation-base"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { validateSetting } from "~/src/collections/gyst-content-service/validate-setting-value"
import { ValidationResult } from "~/src/gyst/common/types/gyst-suite"

export abstract class SettingValueCreateUpdateBaseRequestHandler extends SessionRequestHandlerBase {
  service_id!:string
  setting_value!:any
  service_setting_id!:string

  storeParams():void|Promise<void> {    
    this.service_id = this.req.body.setting_value.service_id
    this.setting_value = this.req.body.setting_value.value
    this.service_setting_id = this.req.body.service_setting_id
  }

  async doTasks():Promise<void> {
    // Validate the value first
    const validation:SettingValueValidationBase = validateSetting(this.service_id, this.service_setting_id, this.user_id!, this.setting_value)

    const validation_result:ValidationResult = await validation.getResult()
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
        validation_result.error_message = "Setting value already exists."
      }
    }

    if(validation_result.is_valid) {
      await this.updateModel(setting_value)
    }
    else {
      return this.sendError(400, "SETTING_VALUE_VALIDATION_ERROR", "Validation failed", validation_result)
    }
  }

  abstract updateModel(setting_value:any):Promise<any>
}