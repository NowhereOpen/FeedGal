import { collection } from "../common/services"

import { refreshTokenIfFailOAuthServiceId } from "../common/refresh-token-if-fail"

// Types
import {
  ServicePaginationReqParam
} from "~/src/common/types/pages/main"
import { EntriesResult, PaginationDirection, PaginationParam } from "../common/services/base/types"


export async function getEntriesPagination(direction:PaginationDirection, param:ServicePaginationReqParam):Promise<EntriesResult> {
  const service_id = param.service_id
  const methods = collection[service_id]
  const service_info = methods.getServiceInfo()

  const pagination_param:PaginationParam = {
    direction,
    pagination_data: param.pagination_data!,
    pagination_value: param.pagination_data![direction],
    setting_value: param.setting_value
  }

  let result:EntriesResult

  if(service_info.is_oauth) {
    const oauth_service_id = service_info.oauth_service_id!

    await refreshTokenIfFailOAuthServiceId(oauth_service_id, param.oauth_connected_user_entry_id!, async (token_data) => {
      result = await collection[service_id].getEntriesPagination(token_data, pagination_param)
    })
  }
  else {
    result = await collection[service_id].getEntriesPagination(pagination_param)
  }

  return result!
}