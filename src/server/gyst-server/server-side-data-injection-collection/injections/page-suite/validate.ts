import _ from "lodash"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"

// Models
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Methods
import { iterateSuiteEntries, validateSettingValue } from "~/src/server/method-collection"

/**
 * Check setting values and oauth accounts are all valid
 */
export async function validate(user_id:string) {
  await validateOAuthAccounts(user_id)
  await iterateSuiteEntries(user_id, async ({ suite_entry, service_info }) => {
    if(service_info.uses_setting_value == false) return

    const service_id = suite_entry.service_id

    try {
      const result = await validateSettingValue(suite_entry.oauth_connected_user_entry_id, suite_entry.service_id, suite_entry.setting_value)
      if(result.is_valid == false) {
        const setting_value_id = suite_entry.setting_value_id!
        await setting_value_storage.invalidateSettingValue(setting_value_id)
      }
    }
    catch(e) {
      if(service_id == "league-of-legends" && _.get(e, "response.status") == 403) {
        console.log(`[injections/page-suite/validate][MERCY MESSAGE] League of Legends API KEY is invalid or expired.`)
      }
      else {
        throw e
      }
    }
  })
}