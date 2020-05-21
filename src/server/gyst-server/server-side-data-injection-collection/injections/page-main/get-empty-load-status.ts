import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { ServiceSetting, SettingValue } from "~/src/common/types/gyst-suite"

import { getServiceInfo, getDisplayedSettingValue } from "~/src/server/loader-module-collection"

/**
 * Merge service setting and its service settings.
 */
export async function getEmptyLoadStatus(user_id:string) {
  const __service_settings = await service_setting_storage.getAllServiceSettingsForUserId(user_id)
  const service_setting_ids = __service_settings.map(entry => entry._id)
  const service_settings:ServiceSetting[] = []

  await Promise.all(
    service_setting_ids.map(async entry => {
      const service_setting = await getServiceSetting(entry._id)

      service_settings.push(service_setting)
    })
  )

  service_settings.sort((a, b) => a.service_name.localeCompare(b.service_name))

  return service_settings
}

async function getServiceSetting(service_setting_id:string) {
  const _entry = await service_setting_storage.getEntry(service_setting_id)
  const entry = _entry!.toJSON()

  const entry_id = entry._id
  const oauth_connected_user_entry_id = entry.oauth_connected_user_entry_id
  const service_id = entry.service_id

  const service_info = getServiceInfo(service_id)

  const _setting_values = await setting_value_storage.getAllSettingValues(entry_id)
  const setting_values = _setting_values.map(_entry => {
    const entry = _entry.toJSON()
    const setting_value = entry.value
    const displayed_as = getDisplayedSettingValue(service_id, setting_value)
    return <SettingValue> {
      _id: entry._id,
      /**
       * 2020-03-19 17:34
       * 
       * Services that use non-string but object structure for setting value
       * (eg. League of Legends `{ region:string, summoner_name:string }`) need this
       * so that it's displayed nicely.
       */
      displayed_as,
      is_invalid: entry.is_invalid,
      value: setting_value
    }
  })

  const service_setting:ServiceSetting = {
    _id: entry._id,
    service_id: entry.service_id,
    service_name: service_info.name,
    alias: entry.alias,
    resource_name: "",
    setting_values,
    is_oauth: service_info.is_oauth,
    uses_setting_value: service_info.uses_setting_value,
    is_disabled: false
  }

  if(service_setting.is_oauth) {
    const connected_user_info = await oauth_connected_user_storage.getEntry(oauth_connected_user_entry_id)
    const is_connected = connected_user_info != null

    service_setting.oauth_info = {
      oauth_id: <string> service_info.oauth_service_id,
      is_connected
    }

    if(is_connected) {
      service_setting.oauth_info.user_info = {
        entry_id: connected_user_info!._id,
        user_id: connected_user_info!.get("service_user_id"),
        friendly_name: connected_user_info!.get("friendly_name"),
        user_uid: connected_user_info!.get("user_uid"),
      }
    }
  }

  return service_setting
}