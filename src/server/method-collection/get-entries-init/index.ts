import { collection } from "../common/services"
import { refreshTokenIfFailOAuthServiceId } from "../common/refresh-token-if-fail"

// Types
import { EntriesResult } from "../common/services/base/types"
import { SuiteEntry } from "~/src/common/types/common/suite"

export async function getEntriesInit(param:SuiteEntry):Promise<EntriesResult> {
  const service_id = param.service_id
  const methods = collection[service_id]
  const service_info = methods.getServiceInfo()

  let result:EntriesResult

  if(service_info.is_oauth) {
    const oauth_service_id = service_info.oauth_service_id!

    await refreshTokenIfFailOAuthServiceId(oauth_service_id, param.oauth_connected_user_entry_id!, async (token_data) => {
      result = await collection[service_id].getEntriesInit(token_data, param.setting_value)
    })
  }
  else {
    result = await collection[service_id].getEntriesInit(param.setting_value)
  }

  return result!
}