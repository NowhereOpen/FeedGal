import { SettingValueCreateUpdateBaseRequestHandler } from "./setting-value-create-update-base"

// Models
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Methods
import { getDisplayedSettingValue } from "~/src/server/method-collection"

// Types
import { SettingValue } from "~/src/common/types/common/suite"

export class PatchUpdateSettingValueRequestHandler extends SettingValueCreateUpdateBaseRequestHandler {
  setting_value_id!:string

  async storeParams() {
    this.setting_value_id = this.req.params.setting_value_id
    await super.storeParams()
  }

  /**
   * 2020-07-05 17:49
   * 
   * Called within `super.storeParams()`
   */
  async getServiceSettingId() {
    const setting_value = await setting_value_storage.getEntry(this.setting_value_id)
    const service_setting_id = setting_value!.get("service_setting_id")
    return service_setting_id
  }

  async updateModel(setting_value:any) {
    await setting_value_storage.updateSettingValue(this.setting_value_id, setting_value)
    const _result = await setting_value_storage.getEntry(this.setting_value_id)
    const result = _result!.toJSON()
    const displayed_as = getDisplayedSettingValue(this.service_id, setting_value)
    
    this.res_data.setting_value = <SettingValue> {
      _id: result._id,
      displayed_as,
      value: result.value,
      is_invalid: false
    }
  }
}