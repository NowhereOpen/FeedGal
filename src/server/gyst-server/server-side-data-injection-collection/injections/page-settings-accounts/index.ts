import { getOAuthInfos } from "./get-oauth-infos"

export async function inject(state:any, user_id:string) {
  const oauth_infos = await getOAuthInfos(user_id!)
  state.oauth_infos = oauth_infos
}