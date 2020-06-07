import { getServiceInfo } from "~/src/server/loader-module-collection"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { FlattenedLoaderParam } from "./type"

export async function flattenServiceSettings(user_id:string):Promise<FlattenedLoaderParam[]> {
  const _service_settings = await service_setting_storage.getEnabledServiceSettingsForUserId(user_id)
  const service_settings = _service_settings.map(entry => entry.toJSON())

  let flattened:FlattenedLoaderParam[] = []
  
  await Promise.all(
    service_settings.map(async service_setting => {
      const service_id = service_setting.service_id
      const service_setting_entry_id = service_setting._id
      
      const service_info = getServiceInfo(service_id)

      const uses_setting_value = service_info.uses_setting_value
      const is_oauth = service_info.is_oauth

      const flattened_entries:FlattenedLoaderParam[] = []

      if(uses_setting_value) {
        const _setting_value_entries = await setting_value_storage.getValidSettingValues(service_setting_entry_id)
        const setting_value_entries = _setting_value_entries.map(setting_value => setting_value.toJSON())

        setting_value_entries.forEach(setting_value_entry => {
          flattened_entries.push({
            service_id,
            service_setting_id: service_setting_entry_id,
            setting_value_id: setting_value_entry._id,
            setting_value: setting_value_entry.value
          })
        })
      }
      else {
        flattened_entries.push({
          service_id,
          service_setting_id: service_setting_entry_id
        })
      }

      if(is_oauth) {
        const oauth_connected_user_entry_id = await service_setting_storage.getOAuthConnectedUserEntryId(service_setting_entry_id)
        flattened_entries.forEach(entry => {
          entry.oauth_connected_user_entry_id = oauth_connected_user_entry_id
        })
      }

      flattened = flattened.concat(flattened_entries)
    })
  )

  return flattened
}