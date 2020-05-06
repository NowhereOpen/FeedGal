import { GystEntryPaginationResponseSuccess, ServicePaginationReqParam } from "~/src/common/types/responses"

import {
  getEntriesPagination as _getEntriesPagination,
  getServiceInfo,
  GetEntriesPaginationParam
} from "~/src/server/loader-module-collection"

import { PaginationDirection, OAuthPaginationParam, NonOAuthPaginationParam } from "~/src/server/loader-module-collection/loader-module-base/types"

import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

export async function getEntriesPagination(
  direction:"new"|"old",
  services_pagination_req_data:ServicePaginationReqParam[],
  cb:(data:GystEntryPaginationResponseSuccess) => Promise<void>
) {
  await Promise.all(
    services_pagination_req_data.map(async (service_pagination_req_param:ServicePaginationReqParam) => {
      let response!:GystEntryPaginationResponseSuccess
      if("error" in service_pagination_req_param) {
        // response = await handlePaginationErrorData(user_id, direction, pagination_data)
      }
      else {
        response = await getEntriesPaginationData(direction, service_pagination_req_param)
      }
      
      cb(response)
    })
  )
}

async function getEntriesPaginationData(
  direction:PaginationDirection,
  service_pagination_req_param:ServicePaginationReqParam
):Promise<GystEntryPaginationResponseSuccess> {
  const service_id = service_pagination_req_param.service_id
  const pagination_current_index = service_pagination_req_param.pagination_data.index

  /**
   * 2020-03-15 15:28
   * 
   * Used in getting gyst entries and included in the response.
   */
  let pagination_updated_index!:number

  if(direction == "new") {
    pagination_updated_index = pagination_current_index - 1
  }
  else if(direction == "old") {
    pagination_updated_index = pagination_current_index + 1
  }

  const service_info = getServiceInfo(service_id)
  
  let param:GetEntriesPaginationParam = {
    pagination_data: service_pagination_req_param.pagination_data,
  }

  if(service_info.uses_setting_value) {
    param.setting_value = service_pagination_req_param.setting_value
  }

  if(service_info.is_oauth) {
    const { oauth_connected_user_entry_id } = service_pagination_req_param
    const token_data = oauth_access_token_storage.getAccessTokenEntry(service_id, oauth_connected_user_entry_id!)

    ;(<OAuthPaginationParam> param).token_data = token_data
  }

  const result = await _getEntriesPagination(
    service_id,
    direction,
    pagination_updated_index,
    <GetEntriesPaginationParam> param
  )
  
  let response:GystEntryPaginationResponseSuccess = {
    service_setting_id: service_pagination_req_param.service_setting_id,
    setting_value_id: service_pagination_req_param.setting_value_id,
    
    entries: result.entries,
    service_response: result.service_response,
    pagination_data: {
      index: pagination_updated_index,
      options: result.pagination_options,
    },
  }

  return response
} 