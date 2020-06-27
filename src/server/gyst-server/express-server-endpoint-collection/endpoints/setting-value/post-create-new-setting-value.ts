import { SettingValueCreateUpdateBaseRequestHandler } from "./setting-value-create-update-base"

import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { getDisplayedSettingValue } from "~/src/server/loader-module-collection"

// Types
import { SettingValue } from "~/src/common/types/common/gyst-suite"

export class PostCreateNewSettingValueRequestHandler extends SettingValueCreateUpdateBaseRequestHandler {
  async updateModel(setting_value:any) {
    const _result = await setting_value_storage.createNewSettingValue(this.service_setting_id, setting_value)
    const result = _result.toJSON()

    const displayed_as = getDisplayedSettingValue(this.service_id, setting_value)
    
    this.res_data.setting_value = <SettingValue> {
      _id: result._id,
      displayed_as,
      value: result.value,
      is_invalid: false
    }
  }
}