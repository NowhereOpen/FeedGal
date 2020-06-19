import { getDisplayedSettingValue, getServiceInfo } from "~/src/server/loader-module-collection"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { refreshTokenIfFailOAuthServiceId } from "~/src/server/method-collection/common"

/**
 * 2020-06-18 06:27 
 * 
 * Used in:
 * 
 *   * src/server/gyst-server/server-side-data-injection-collection/injections/page-suite/validate.ts
 *   * src/server/gyst-server/server-side-data-injection-collection/injections/page-settings-accounts/index.ts
 * 
 * So, if this function is needed with 'little change', refactor acordingly.
 * 
 * Again, invalidating IS required in both files.
 */
export async function validateOAuthAccounts(user_id:string) {
  const service_settings = await service_setting_storage.getAllServiceSettingsForUserId(user_id)
  await Promise.all(
    service_settings.map(async _service_setting => {
      const service_setting = _service_setting.toJSON()
      const service_id = service_setting.service_id
      const service_info = getServiceInfo(service_id)

      if(service_info.is_oauth) {
        const oauth_service_id = service_info.oauth_service_id!
        const oauth_connected_user_entry_id = service_setting.oauth_connected_user_entry_id

        await validateOAuthAccount(oauth_service_id, oauth_connected_user_entry_id)
      }
    })
  )
}

async function validateOAuthAccount(oauth_service_id:string, oauth_connected_user_entry_id:string) {
  try {
    await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_connected_user_entry_id, async () => {

    })
  }
  catch(e) {
    /**
     * 2020-06-18 06:44
     * 
     * Expects error related with "expired or invalid token" or something. This means refreshing token
     * failed and the likely cause is that the user revoked from the outside service page "manage
     * authorized apps" or something.
     */
    
    if(e) {
      await oauth_connected_user_storage.setError(oauth_connected_user_entry_id, true)
    }
  }
}