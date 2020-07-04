import { ErrorOnRefreshRequest } from "oauth-module-suite"

import { ValidateOAuthAccount } from "~/src/server/method-collection/oauth"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

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
      const oauth_service_id = oauth_account.service_id
      const oauth_user_entry_id = oauth_account._id

      const is_error = await oauth_connected_user_storage.isErrorWithOAuthUserEntryId(oauth_user_entry_id)

      if(is_error) return

      new ValidateOAuthAccount({ oauth_service_id, oauth_user_entry_id }).run(async (e) => {
        /**
         * 2020-06-18 06:44
         * 
         * Expects error related with "expired or invalid token" or something. This means refreshing token
         * failed and the likely cause is that the user revoked from the outside service page "manage
         * authorized apps" or something.
         */
        
        if(e instanceof ErrorOnRefreshRequest) {
          await oauth_connected_user_storage.setError(oauth_user_entry_id, true)
        }
      })
    })
  )
}