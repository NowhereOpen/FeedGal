import { getServiceInfo, getEntriesInitNonOAuth, getEntriesInitOAuth } from "~/src/server/loader-module-collection"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"
import { FlattenedLoaderParam } from "./type"
import { refreshTokenIfFail } from "../common"
import { GystEntryResponseSuccess } from "~/src/common/types/pages/main"
import { handleError } from "~/src/server/method-collection/common/get-entries"

export async function getEntriesInitWithParam(param:FlattenedLoaderParam):Promise<GystEntryResponseSuccess> {
  const {
    service_id,
    service_setting_id,
    setting_value_id,
    setting_value,
    oauth_connected_user_entry_id
  } = param
  
  let response!:GystEntryResponseSuccess
  let output:LoaderModuleOutput = {
    entries:[], service_response: null
  }
  const warning = await handleError(
    param,
    async () => {
      output = await _getEntriesInitWithParam(param)
      return output
    }
  )

  response = {
    entries: output.entries,
    pagination_data: output.pagination_data,
    service_response: output.service_response,
    oauth_connected_user_entry_id,
    service_id,
    service_setting_id,
    setting_value,
    setting_value_id,
    warning
  }

  return response
}

async function _getEntriesInitWithParam(param:FlattenedLoaderParam):Promise<LoaderModuleOutput> {
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