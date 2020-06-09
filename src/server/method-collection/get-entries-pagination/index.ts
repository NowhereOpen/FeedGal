import {
  GystEntryResponseSuccess,
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

import { handleError } from "~/src/server/method-collection/common"

import { refreshTokenIfFail } from "../common"

export type PaginationOutput = { result: LoaderModuleOutput, pagination_updated_index:number }

export async function getEntriesPaginationData(
  direction:PaginationDirection,
  service_pagination_req_param:ServicePaginationReqParam
):Promise<GystEntryResponseSuccess> {
  const {
    service_id,
    service_setting_id,
    setting_value,
    setting_value_id,
    pagination_data,
    oauth_connected_user_entry_id,
  } = service_pagination_req_param

  let pagination_output!:PaginationOutput

  const warning = await handleError(
    { service_id, pagination_options: pagination_data.options },
    async () => {
      pagination_output = await _getEntriesPaginationData(direction, service_pagination_req_param)
      return pagination_output.result
    }
  )

  let output:LoaderModuleOutput = { entries: [], service_response: null, pagination_options: pagination_data.options }
  let index = service_pagination_req_param.pagination_data.index

  if(warning == undefined) {
    const { result, pagination_updated_index } = pagination_output
    output = result
    index = pagination_updated_index
  }

  const response:GystEntryResponseSuccess = {
    service_id,
    service_setting_id,
    setting_value_id,
    setting_value,
    oauth_connected_user_entry_id,
    entries: output.entries,
    service_response: output.service_response,
    pagination_data: { index, options: output.pagination_options },
    warning
  }

  return response
}

async function _getEntriesPaginationData(
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