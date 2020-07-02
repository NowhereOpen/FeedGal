import { collection } from "../common/services"

import { refreshTokenIfFailOAuthServiceId } from "../common/refresh-token-if-fail"
import { ServiceSetting } from "~/src/common/types/pages/suite"

// Types
import { ValidationResult } from "../common/services/base/types"

const service_ids = ["github", "google-calendar", "league-of-legends"]

export async function validateSettingValue(service_setting:ServiceSetting, setting_value:any) {
  const service_id = service_setting.service_id
  const methods = collection[service_id]
  const service_info = methods.getServiceInfo()

  let result:ValidationResult

  if(service_info.is_oauth) {
    const oauth_service_id = service_info.oauth_service_id!
    const oauth_user_entry_id = service_setting.oauth_info!.user_info!.entry_id

    await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_user_entry_id, async (token_data:any) => {
      result = await collection[service_id].validateSettingValue!(token_data, setting_value)
    })
  }
  else {
    result = await collection[service_id].validateSettingValue!(setting_value)
  }

  return result!
}