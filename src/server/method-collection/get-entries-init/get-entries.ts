import { getServiceInfo, getEntriesInitNonOAuth, getEntriesInitOAuth } from "~/src/server/loader-module-collection"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"
import { FlattenedLoaderParam } from "./type"
import { refreshTokenIfFail } from "../common"

export async function getEntriesInitWithParam(param:FlattenedLoaderParam):Promise<LoaderModuleOutput> {
  const service_id = param.service_id
  const is_oauth = getServiceInfo(service_id).is_oauth
  const setting_value = param.setting_value

  let result!:LoaderModuleOutput
  if(is_oauth) {
    const oauth_connected_user_entry_id = param.oauth_connected_user_entry_id!
    await refreshTokenIfFail(service_id, oauth_connected_user_entry_id, async (token_data) => {
      result = await getEntriesInitOAuth(service_id, token_data, setting_value)
    })
  }
  else {
    result = await getEntriesInitNonOAuth(service_id, setting_value)
  }

  return result
}