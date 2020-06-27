import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

import { validateOAuthAccounts } from "../../common/validate-oauth-account"
import { getOAuthInfos } from "./get-oauth-infos"

// Types
import { State } from "~/src/common/types/pages/settings-accounts"

export async function inject(state:State, user_id:string) {
  await validateOAuthAccounts(user_id)
  const oauth_infos = await getOAuthInfos(user_id!)
  state.oauth_infos = oauth_infos
  state.service_settings = await getServiceSettingsForGystSuiteId(user_id)
}