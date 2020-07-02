import { getDisplayedSettingValue, getServiceInfo } from "~/src/server/method-collection"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"

/**
 * Check setting values and oauth accounts are all valid
 */
export async function validate(user_id:string) {
  await validateOAuthAccounts(user_id)
  const service_settings = await service_setting_storage.getAllServiceSettingsForUserId(user_id)
  await Promise.all(
    service_settings.map(async _service_setting => {
      const service_setting = _service_setting.toJSON()
      const service_id = service_setting.service_id
      const service_info = getServiceInfo(service_id)

      if(service_info.uses_setting_value) {
        const service_setting_id = service_setting._id
        const setting_values = await setting_value_storage.getAllSettingValues(service_setting_id)
        await Promise.all(
          setting_values.map(async (_setting_value) => {
            const setting_value = _setting_value.toJSON()
            try {

            }
            catch(e) {
              /**
               * 2020-06-18 06:19
               * 
               * Invalid oauth authentication data should be already handled head.
               */
              const setting_value_id = setting_value._id
              await setting_value_storage.invalidateSettingValue(setting_value_id)
            }
          })
        )
      }
    })
  )
}