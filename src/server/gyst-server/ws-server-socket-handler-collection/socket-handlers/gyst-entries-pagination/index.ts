import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { getEntriesInitWithParam, FlattenedLoaderParam } from "~/src/server/method-collection/get-entries-init"
import { getEntriesPaginationData } from "~/src/server/method-collection/get-entries-pagination"
import { commonErrorDetailGenerator } from "~/src/server/method-collection/common"
import {
  ServicePaginationReqParam,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError
} from "~/src/common/types/gyst-entry"

import { validateOwnership } from "./validate-ownership"
import { LoaderModuleOutput, PaginationDirection } from "~/src/server/loader-module-collection/loader-module-base/types"

export class GystEntriesWithPaginationSocketHandler extends SessionSocketEventHandler {
  respond(data:any) {
    this.socket.emit("gyst-entries-with-pagination-response", data)
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
    const {
      service_id,
      service_setting_id,
      setting_value_id,
      setting_value,
      warning,
      oauth_connected_user_entry_id
    } = service_pagination_req_param

    let response!:GystEntryResponse

    try {
      if(warning && warning.name == "RATE_LIMIT" && service_pagination_req_param.pagination_data == undefined) {
        const response:GystEntryResponseSuccess = await getEntriesInitWithParam(<FlattenedLoaderParam> {
          service_id,
          service_setting_id,
          oauth_connected_user_entry_id,
          setting_value,
          setting_value_id
        })
        return this.respond(response)
      }
      else {
        response = await getEntriesPaginationData(direction, service_pagination_req_param)
      }
    }
    catch(e) {
      const error_detail = commonErrorDetailGenerator(e)
      response = <GystEntryResponseError> {
        service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id, 
        error: error_detail
      }
    }
    
    this.respond(response)
  }
}