import { iterateServiceSettings } from "../iterate-service-settings"

// Types
import { ServiceInfo } from "../common/services/base/types"
import { SettingValue } from "~/src/common/types/models/setting-value"
import { SuiteEntry } from "~/src/common/types/common/suite"
import { CallbackParam as _CallbackParam, IncludeOption } from "../iterate-service-settings"

// Models
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

type CallbackParam = { suite_entry:SuiteEntry, service_info:ServiceInfo }
type Callback = (param:CallbackParam) => Promise<void>

/**
 * 2020-07-05 15:19
 * 
 * Would accept `suite_id` in the future
 */
export async function iterateSuiteEntries(user_id:string, cb:Callback, option?:IncludeOption) {
  await iterateServiceSettings(user_id, async (args) => {
    const service_setting = args.service_setting!
    const service_info = args.service_info!

    const suite_entry:SuiteEntry = {
      service_id: service_setting.service_id,
      service_setting_id: service_setting._id,
      oauth_connected_user_entry_id: service_setting.oauth_connected_user_entry_id,
    }

    if(service_info!.uses_setting_value) {
      const setting_values = await setting_value_storage.getValidSettingValues(service_setting._id)
      await Promise.all(
        setting_values.map(async entry => {
          const setting_value_entry:SettingValue = entry.toJSON()
          
          suite_entry.setting_value = setting_value_entry.value
          suite_entry.setting_value_id = setting_value_entry._id

          await cb({ suite_entry, service_info })
        })
      )
    }
    else {
      await cb({ suite_entry, service_info })
    }

  }, { oauth_account: false, service_info: true })
}
export { IncludeOption } from "../iterate-service-settings"