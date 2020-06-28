import {
  LoadStatus,
  ClientSideField,
  LoadStatusServiceSetting,
  LoadStatusSettingValue
} from "~/src/common/types/pages/main"
import {
  GystEntryResponseSuccess
} from "~/src/common/types/pages/main/loader"
import { LoadEntryParam } from "~/src/common/types/common/load-entry-param"
import { GystEntryWrapper as GystEntryWrapperType } from "~/src/common/types/pages/main"

export function gystEntriesFromResponse(response:GystEntryResponseSuccess | GystEntryResponseSuccess) {
  if("error" in response) return [];

  const entries = (<GystEntryResponseSuccess>response).entries
  const wrapper_entries = entries.map(entry => (<GystEntryWrapperType> {
    entry,
    load_entry_param_detail: {
      service_setting_id: response.service_setting_id,
      setting_value_id: response.setting_value_id,

      oauth_connected_user_entry_id: response.oauth_connected_user_entry_id,
      service_id: response.service_id,
      setting_value: response.setting_value,
    }
  }))

  return wrapper_entries
}

export function getParam(load_entry_param:LoadEntryParam, load_status:LoadStatus):ClientSideField {
  const { service_setting_id, setting_value_id } = load_entry_param

  const service_setting = load_status.find(entry => entry._id == service_setting_id)!

  if(setting_value_id == null) return service_setting

  const setting_value = service_setting.setting_values.find(entry => entry._id == setting_value_id)!
  return setting_value
}


export async function iterateLoadStatus(
  load_status:LoadStatus,
  cb:(a:LoadStatusServiceSetting, b?:LoadStatusSettingValue) => (Promise<void>|void)
):Promise<void> {
  await Promise.all(
    load_status.map(async service_setting => {
      if(service_setting.uses_setting_value) {
        await Promise.all(
          service_setting.setting_values.map(async setting_value => {
            cb(service_setting, setting_value)
          })
        )
      }
      else {
        await cb(service_setting)
      }
    })
  )
}