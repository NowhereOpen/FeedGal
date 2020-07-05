import { getSuiteServiceSettingsForUserId } from "~/src/server/gyst-server/common/gyst-suite"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"
import { getOAuthInfos } from "./get-oauth-infos"

// Types
import { State } from "~/src/common/types/pages/settings-accounts"

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
  const oauth_infos = await getOAuthInfos(user_id!)
  state.oauth_infos = oauth_infos
  state.service_settings = await getSuiteServiceSettingsForUserId(user_id)
}