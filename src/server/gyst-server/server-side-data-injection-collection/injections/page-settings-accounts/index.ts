import { validateOAuthAccounts } from "../../common/validate-oauth-account"
import { getOAuthInfos } from "./get-oauth-infos"
import { getOAuthConnectedAccounts } from "./get-oauth-connected-accounts"

// Types
import { State } from "~/src/common/types/pages/settings-accounts"

export async function inject(state:State, user_id:string) {
  await validateOAuthAccounts(user_id)
  const oauth_infos = await getOAuthInfos()
  state.oauth_infos = oauth_infos

  /**
   * 2020-07-06 20:24
   * 
   * Don't merge oauth_infos and oauth_connected_accounts because when updating
   * or removing oauth accounts, it's easier to just splice this array, and when
   * displaying connected accounts for `oauth_infos`, it's just as easy as
   * filtering accounts whose oauth_service_id is that of oauth_info.
   */
  state.oauth_connected_accounts = await getOAuthConnectedAccounts(user_id)
}