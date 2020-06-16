import { getOAuthInfos } from "./get-oauth-infos"
import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

export async function inject(state:any, user_id:string) {
  const oauth_infos = await getOAuthInfos(user_id!)
  state.oauth_infos = oauth_infos
  state.service_settings = await getServiceSettingsForGystSuiteId(user_id)
}