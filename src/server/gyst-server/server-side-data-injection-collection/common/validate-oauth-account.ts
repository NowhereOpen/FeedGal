import { ErrorOnRefreshRequest } from "oauth-module-suite"

import { getDisplayedSettingValue, getServiceInfo } from "~/src/server/loader-module-collection"

import { cred_module_collection } from "~/src/server/cred-module-collection"

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
  const oauth_accounts = await oauth_connected_user_storage.getAllAliveAccounts(user_id)
  await Promise.all(
    oauth_accounts.map(async _oauth_account => {
      const oauth_account = _oauth_account.toJSON()
      const service_id = oauth_account.service_id
      const oauth_connected_user_entry_id = oauth_account._id

      const is_error = await oauth_connected_user_storage.isErrorWithOAuthUserEntryId(oauth_connected_user_entry_id)

      if(is_error) return

      await validateOAuthAccount(service_id, oauth_connected_user_entry_id)
    })
  )
}

async function validateOAuthAccount(oauth_service_id:string, oauth_connected_user_entry_id:string) {
  try {
    await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_connected_user_entry_id, async (token_data) => {
      const user_info = await cred_module_collection[oauth_service_id].getUserInfo(token_data)
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
    
    if(e instanceof ErrorOnRefreshRequest) {
      await oauth_connected_user_storage.setError(oauth_connected_user_entry_id, true)
    }
  }
}