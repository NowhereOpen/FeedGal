import { loader_collection } from "~/src/server/loader-module-collection"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

export async function getEntriesPagination(
  user_id:string,
  direction:"new"|"old",
  services_pagination_req_data:any,
  cb:(data:any) => Promise<void>
) {
  await Promise.all(
    services_pagination_req_data.map(async (pagination_req_data:PaginationReqData) => {
      let response!:any//GystEntryPaginationResponse
      if("error" in pagination_req_data) {
        // response = await handlePaginationErrorData(user_id, direction, pagination_req_data)
      }
      else {
        response = await handlePaginationData(user_id, direction, pagination_req_data)
      }
      
      cb(response)
    })
  )
}

async function handlePaginationData(
  user_id:string,
  direction:PaginationDirection,
  pagination_req_data:PaginationReqDataSuccess
):Promise<GystEntryPaginationResponseSuccess> {
  const service_id = pagination_req_data.service_id
  const pagination_current_index = pagination_req_data.pagination_data.index
  const oauth_connected_user_entry_id = pagination_req_data.oauth_connected_user_entry_id

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

  const instance = loader_collection[service_id]
  await instance.loadGystEntryResponseWithPagination((<PaginationDirection> direction), pagination_updated_index, pagination_req_data)
  
  let response:GystEntryPaginationResponseSuccess = {
    gyst_suite_id: pagination_req_data.gyst_suite_id,
    service_setting_id: pagination_req_data.service_setting_id,
    setting_value_id: pagination_req_data.setting_value_id,
    
    gyst_entries: instance.result.gyst_entries,
    service_response: instance.result.service_response,
    pagination_data: {
      index: pagination_updated_index,
      options: instance.result.pagination_options,
    },
  }

  return response
} 