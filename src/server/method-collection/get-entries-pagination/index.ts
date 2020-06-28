import {
  GystEntryResponseSuccess,
  ServicePaginationReqParam
} from "~/src/common/types/pages/main"

import {
  getServiceInfo,
  getEntriesPaginationNonOAuth,
  getEntriesPaginationOAuth
} from "~/src/server/loader-module-collection"

import {
  PaginationDirection,
  LoaderModuleOutput
} from "~/src/server/loader-module-collection/loader-module-base/types"

import { handleError } from "~/src/server/method-collection/common/get-entries"

import { refreshTokenIfFail } from "../common"

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

  let output:LoaderModuleOutput = { entries: [], service_response: null, pagination_data }

  const warning = await handleError(
    service_pagination_req_param,
    async () => {
      output = await _getEntriesPaginationData(direction, service_pagination_req_param)
      return output
    }
  )

  const response:GystEntryResponseSuccess = {
    service_id,
    service_setting_id,
    setting_value_id,
    setting_value,
    oauth_connected_user_entry_id,
    entries: output.entries,
    service_response: output.service_response,
    pagination_data: output.pagination_data,
    warning
  }

  return response
}

async function _getEntriesPaginationData(
  direction:PaginationDirection,
  service_pagination_req_param:ServicePaginationReqParam
):Promise<LoaderModuleOutput> {
  const service_id = service_pagination_req_param.service_id

  const is_oauth = getServiceInfo(service_id).is_oauth
  const pagination_data = service_pagination_req_param.pagination_data!
  const setting_value = service_pagination_req_param.setting_value

  let result!:LoaderModuleOutput
  const { oauth_connected_user_entry_id } = service_pagination_req_param
  if(is_oauth) {
    await refreshTokenIfFail(service_id, oauth_connected_user_entry_id!, async (token_data) => {
      result = await getEntriesPaginationOAuth(service_id, direction, pagination_data, token_data, setting_value)
    })
  }
  else {
    result = await getEntriesPaginationNonOAuth(service_id, direction, pagination_data, setting_value)
  }

  return result
}