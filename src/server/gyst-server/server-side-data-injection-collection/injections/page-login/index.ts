import { getOAuthInfos } from "./get-oauth-infos"
import { getUserInfo } from "./get-user-info"
import { State } from "~/src/common/types/pages/login"

export async function inject(state:State, is_logged_in:boolean, user_id?:string) {
  if(is_logged_in) {
    const user_info = await getUserInfo(user_id!)
    state.user_info = user_info
  }
  const oauth_infos = await getOAuthInfos()
  state.oauth_infos = oauth_infos
}