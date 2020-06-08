import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { LoadStatus, LoadEntryParamInstance } from "~/src/common/types/loader"

import { getServiceInfo, getDisplayedSettingValue } from "~/src/server/loader-module-collection"

/**
 * Merge service setting and its service settings.
 */
export async function getEmptyLoadStatus(user_id:string) {
  const service_settings = await service_setting_storage.getAllServiceSettingsForUserId(user_id)
  const load_status:LoadStatus = []

  await Promise.all(
    service_settings.map(async _service_setting => {
      const service_setting = _service_setting.toJSON()
      /**
       * 2020-06-05 00:54
       * This fixes `service_setting_id` becoming a weird Object type on the client side
       * after editing the gyst suite. This happened to "League of Legends" entry when I
       * added more than one setting values.
       */
      const service_setting_id = String(service_setting._id)
      const service_id = service_setting.service_id
      const service_info = getServiceInfo(service_id)
      const service_name = service_info.name

      const load_entry_param_instance:LoadEntryParamInstance = {
        service_id,
        service_name,
        service_setting_id,
        is_disabled: service_setting.is_disabled,
        oauth_connected_user_entry_id: service_setting.oauth_connected_user_entry_id,
        is_loading: true,
        total: 0
      }

      if(service_info.uses_setting_value) {
        const setting_values = await setting_value_storage.getAllSettingValues(service_setting_id)
        setting_values.forEach(_setting_value => {
          const setting_value = _setting_value.toJSON()
          const value = setting_value.value
          const displayed_as = getDisplayedSettingValue(service_id, value)
          const param_instance:LoadEntryParamInstance = Object.assign(
            {
              setting_value_id: setting_value._id,
              setting_value: value,
              displayed_as,
              is_invalid: setting_value.is_invalid
            },
            load_entry_param_instance
          )

          load_status.push(param_instance)
        })
      }
      else {
        load_status.push(load_entry_param_instance)
      }
    })
  )

  load_status.sort((a, b) => a.service_name.localeCompare(b.service_name))

  return load_status
}