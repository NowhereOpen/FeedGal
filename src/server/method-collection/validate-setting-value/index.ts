import { collection } from "../common/services"

import { refreshTokenIfFailOAuthServiceId } from "../common/refresh-token-if-fail"

// Types
import { ValidationResult } from "~/src/common/types/pages/suite"
import { ServiceSetting } from "~/src/common/types/models/service-setting"
import { SuiteEntry } from "../iterate-suite-entries"

const service_ids = ["github", "google-calendar", "league-of-legends"]

export async function validateSettingValue(
  suite_entry:SuiteEntry,
  service_info:any
) {
  const service_id = suite_entry.service_id
  const setting_value = suite_entry.setting_value!

  let result:ValidationResult

  if(service_info.is_oauth) {
    const oauth_service_id = service_info.oauth_service_id!
    const oauth_account_entry_id = suite_entry.oauth_connected_user_entry_id!

    await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_account_entry_id, async (token_data:any) => {
      result = await collection[service_id].validateSettingValue!(token_data, setting_value)
    })
  }
  else {
    result = await collection[service_id].validateSettingValue!(setting_value)
  }

  return result!
}