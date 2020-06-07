import {
  GystEntryPaginationResponse,
  GystEntryPaginationResponseSuccess,
  GystEntryPaginationResponseError,
  ServicePaginationReqParam
} from "~/src/common/types/gyst-entry"

import {
  getServiceInfo,
  getEntriesPaginationNonOAuth,
  getEntriesPaginationOAuth
} from "~/src/server/loader-module-collection"

import {
  PaginationDirection,
  LoaderModuleOutput
} from "~/src/server/loader-module-collection/loader-module-base/types"

import { refreshTokenIfFail } from "../common"

export type PaginationOutput = { result: LoaderModuleOutput, pagination_updated_index:number }

export async function getEntriesPaginationData(
  direction:PaginationDirection,
  service_pagination_req_param:ServicePaginationReqParam
):Promise<PaginationOutput> {
  const service_id = service_pagination_req_param.service_id
  const pagination_current_index = service_pagination_req_param.pagination_data.index

  /**
   * 2020-03-15 15:28
   * 
   * Used in getting gyst entries and included in the response.
   */
  let pagination_updated_index!:number

  if(direction == "new") {
    pagination_updated_index = pagination_updated_index - 1
  }
  else if(direction == "old") {
    pagination_updated_index = pagination_updated_index + 1
  }

  const is_oauth = getServiceInfo(service_id).is_oauth
  const pagination_data = service_pagination_req_param.pagination_data
  const setting_value = service_pagination_req_param.setting_value

  let result!:LoaderModuleOutput
  const { oauth_connected_user_entry_id } = service_pagination_req_param
  if(is_oauth) {
    await refreshTokenIfFail(service_id, oauth_connected_user_entry_id!, async (token_data) => {
      result = await getEntriesPaginationOAuth(service_id, direction, pagination_updated_index, pagination_data, token_data, setting_value)
    })
  }
  else {
    result = await getEntriesPaginationNonOAuth(service_id, direction, pagination_updated_index, pagination_data, setting_value)
  }

  return { result, pagination_updated_index }
}