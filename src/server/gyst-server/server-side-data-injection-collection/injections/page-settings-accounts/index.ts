import { getSuiteServiceSettingsForUserId } from "~/src/server/gyst-server/common/gyst-suite"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"
import { getOAuthInfos } from "./get-oauth-infos"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

// Types
import { State } from "~/src/common/types/pages/settings-accounts"
import { OAuthConnectedUser } from "~/src/common/types/models/oauth-connected-user"

export async function inject(state:State, user_id:string) {
  await validateOAuthAccounts(user_id)
  /**
   * 2020-07-05 13:47
   * 
   * Referring to 2020-w28-todo2: https://trello.com/c/gShCvqKe/237-2020-w28-todos
   * 
   * Instead of using `getSuiteServiceSettingsForUserId` to get the information where the
   * oauth account is being used, `getOAuthInfos` could retrieve that information in it.
   * And by doing so client side evaluation is lessened. Eg, `isInUse` can be just
   * accessing a property assigned in `getOAuthInfos`.
   */
  const oauth_infos = await getOAuthInfos()
  state.oauth_infos = oauth_infos
  /**
   * 2020-07-05 13:21
   * 
   * Used in 'remove/revoke confirm dialog' to inform the user about where the oauth account is
   * being used.
   * 
   * It's very probablye that this may be removed in the future.
   * 
   * Todo: https://trello.com/c/gShCvqKe/237-2020-w28-todos
   */
  state.service_settings = await getSuiteServiceSettingsForUserId(user_id)

  const connected_accounts = await oauth_connected_user_storage.getAllEntriesForUserId(user_id)
  state.oauth_connected_accounts = connected_accounts.map((entry) => <OAuthConnectedUser> <any>entry)
}