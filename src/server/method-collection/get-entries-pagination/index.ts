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

import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

import { refreshTokenIfFail } from "../common"

export async function getEntriesPagination(
  direction:"new"|"old",
  services_pagination_req_data:ServicePaginationReqParam[],
  cb:(data:GystEntryPaginationResponse) => Promise<void>
) {
  await Promise.all(
    services_pagination_req_data.map(async (service_pagination_req_param:ServicePaginationReqParam) => {
      const { service_id, service_setting_id, setting_value_id, setting_value } = service_pagination_req_param
      let response!:GystEntryPaginationResponse
      if("error" in service_pagination_req_param) {
        /**
         * 2020-05-28 17:38
         * 
         * Error was thrown while loading init entries.
         * 
         * Can't just 'ignore' when sending `service_pagination_req_data` on the client side because
         * we could make init request again. Or ignore and notify the user to refresh the page or
         * manually request for init entries after making changes.
         */
        response = <GystEntryPaginationResponseError> {
          service_id, service_setting_id, setting_value_id, setting_value,
          error: {
            data: {},
            message: "Error was thrown while loading init entries.",
            name: "DEV_FAULT"
          }
        }
      }
      else {
        try {
          response = await getEntriesPaginationData(direction, service_pagination_req_param)
        }
        catch(e) {
          response = <GystEntryPaginationResponseError> {
            service_id, service_setting_id, setting_value_id, setting_value,
            error: {
              data: e,
              message: "Something went wrong",
              name: "DEV_FAULT"
            }
          }
        }
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
  
  let response:GystEntryPaginationResponseSuccess = {
    service_setting_id: service_pagination_req_param.service_setting_id,
    setting_value_id: service_pagination_req_param.setting_value_id,
    setting_value,
    service_id,
    oauth_connected_user_entry_id,
    
    entries: result.entries,
    service_response: result.service_response,
    pagination_data: {
      index: pagination_updated_index,
      options: result.pagination_options,
    },
  }

  return response
} 