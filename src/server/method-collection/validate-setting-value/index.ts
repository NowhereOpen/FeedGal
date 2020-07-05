import { collection } from "../common/services"

import { refreshTokenIfFailOAuthServiceId } from "../common/refresh-token-if-fail"

// Types
import { ValidationResult } from "~/src/common/types/pages/suite"

const service_ids = ["github", "google-calendar", "league-of-legends"]

export async function validateSettingValue(
  oauth_account_entry_id:undefined|string,
  service_id:string,
  setting_value:any
) {
  let result:ValidationResult

  if(oauth_account_entry_id) {
    const oauth_service_id = collection[service_id].getServiceInfo().oauth_service_id!
    await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_account_entry_id, async (token_data:any) => {
      result = await collection[service_id].validateSettingValue!(token_data, setting_value)
    })
  }
  else {
    result = await collection[service_id].validateSettingValue!(setting_value)
  }

  return result!
}