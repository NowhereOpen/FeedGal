import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"
import { getOAuthInfos } from "./get-oauth-infos"

// Types
import { State } from "~/src/common/types/pages/settings-accounts"

export async function inject(state:State, user_id:string) {
  await validateOAuthAccounts(user_id)
  const oauth_infos = await getOAuthInfos(user_id!)
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
  state.service_settings = await getServiceSettingsForGystSuiteId(user_id)
}