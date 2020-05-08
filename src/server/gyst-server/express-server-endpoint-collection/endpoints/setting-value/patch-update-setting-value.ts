import { SettingValueCreateUpdateBaseRequestHandler } from "./setting-value-create-update-base"

import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"
import { SettingValue } from "~/src/common/types/gyst-suite"
import { getDisplayedSettingValue } from "~/src/collections/gyst-content-service/get-displayed-setting-value"

export class PatchUpdateSettingValueRequestHandler extends SettingValueCreateUpdateBaseRequestHandler {
  setting_value_id!:string

  storeParams() {
    super.storeParams()

    this.setting_value_id = this.req.params.setting_value_id
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