import _ from "lodash"

import { getEntriesInit, FlattenedLoaderParam } from "~/src/server/method-collection/get-entries-init"
import { getEntriesPagination } from "~/src/server/method-collection/get-entries-pagination"

import { SessionSocketEventHandler } from "../../socket-handler-base/session"

import { commonErrorDetailGenerator } from "../../common"
import { throwControlledError, handleError } from "../../common/convert-error"
import { validateOwnership } from "./validate-ownership"

// Types
import {
  ServicePaginationReqParam,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError
} from "~/src/common/types/pages/main"
import { EntriesResult, PaginationDirection } from "~/src/server/method-collection/common/services/base/types"
import { ErrorName, ErrorObject } from "~/src/common/types/common/warning-error"

export class GystEntriesWithPaginationSocketHandler extends SessionSocketEventHandler {
  respond(param:ServicePaginationReqParam, entries_result:EntriesResult) {
    const { service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id } = param

    this.socket.emit("gyst-entries-pagination-response", <GystEntryResponseSuccess>{
      service_id,
      oauth_connected_user_entry_id,
      setting_value,
      service_setting_id,
      setting_value_id,
      entries: entries_result.entries,
      pagination_data: entries_result.pagination_data,
      service_response: entries_result.service_response,
      warning: entries_result.warning
    })
  }

  respondError(param:ServicePaginationReqParam, error:ErrorObject) {
    const { service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id } = param

    this.socket.emit("gyst-entries-pagination-error", <GystEntryResponseError>{
      service_id,
      oauth_connected_user_entry_id,
      setting_value,
      service_setting_id,
      setting_value_id,
      error,
    })
  }

  async handleImpl() {
    const services_pagination_req_data:ServicePaginationReqParam[] = this.req.pagination_req_data

    const direction:PaginationDirection = this.req.direction

    const oauth_connected_user_entry_ids:string[] = services_pagination_req_data
      .filter(entry => entry.oauth_connected_user_entry_id)
      .map(({ oauth_connected_user_entry_id }) => <string> oauth_connected_user_entry_id)
    const validate_ownership = await validateOwnership(this.user_id!, oauth_connected_user_entry_ids)

    if(validate_ownership) {
      // Something weird happened on the client side.
    }

    services_pagination_req_data.forEach(async (service_pagination_req_param:ServicePaginationReqParam) => {
      this.makePaginationRequest(direction, service_pagination_req_param)
    })
  }

  async makePaginationRequest(direction:PaginationDirection, service_pagination_req_param:ServicePaginationReqParam) {
    const error = await throwControlledError(service_pagination_req_param)
    if(error) {
      return this.respondError(service_pagination_req_param, error)
    }

    try {
      let entries_result:EntriesResult
      if(_.get(service_pagination_req_param, "warning.name") == "RATE_LIMIT" && service_pagination_req_param.pagination_data == undefined) {
        entries_result = await getEntriesInit(<FlattenedLoaderParam> service_pagination_req_param)
      }
      else {
        entries_result = await getEntriesPagination(direction, service_pagination_req_param)
      }

      this.respond(service_pagination_req_param, entries_result)
    }
    catch(e) {
      const error = await handleError(service_pagination_req_param, e)
      return this.respondError(service_pagination_req_param, error)
    }
  }
}