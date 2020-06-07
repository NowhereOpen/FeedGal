import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { getEntriesInitWithParam, FlattenedLoaderParam } from "~/src/server/method-collection/get-entries-init"
import { getEntriesPaginationData } from "~/src/server/method-collection/get-entries-pagination"
import { commonErrorDetailGenerator } from "~/src/server/method-collection/common"
import {
  ServicePaginationReqParam,
  GystEntryPaginationResponse,
  GystEntryPaginationResponseSuccess,
  GystEntryPaginationResponseError,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError
} from "~/src/common/types/gyst-entry"

import { validateOwnership } from "./validate-ownership"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"

export class GystEntriesWithPaginationSocketHandler extends SessionSocketEventHandler {
  respond(data:any) {
    this.socket.emit("gyst-entries-with-pagination-response", data)
  }

  async handleImpl() {
    const services_pagination_req_data:ServicePaginationReqParam[] = this.req.pagination_req_data

    const direction = this.req.direction

    const oauth_connected_user_entry_ids:string[] = services_pagination_req_data
      .filter(entry => entry.oauth_connected_user_entry_id)
      .map(({ oauth_connected_user_entry_id }) => <string> oauth_connected_user_entry_id)
    const validate_ownership = await validateOwnership(this.user_id!, oauth_connected_user_entry_ids)

    if(validate_ownership) {
      // Something weird happened on the client side.
    }

    await Promise.all(
      services_pagination_req_data.map(async (service_pagination_req_param:ServicePaginationReqParam) => {
        const { service_id, service_setting_id, setting_value_id, setting_value, warning, oauth_connected_user_entry_id } = service_pagination_req_param

        let response:GystEntryResponse|GystEntryPaginationResponse

        try {
          let entry_output!:LoaderModuleOutput
          if(warning && warning.name == "RATE_LIMIT") {
            const { service_response, pagination_options:options, entries } = await getEntriesInitWithParam(<FlattenedLoaderParam> {
              service_id,
              service_setting_id,
              oauth_connected_user_entry_id,
              setting_value,
              setting_value_id
            })
            response = <GystEntryResponseSuccess> {
              service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id,
              entries, service_response, pagination_data: { index: 0, options }, warning: undefined
            }
          }
          else {  
            const {
              result: { service_response, pagination_options: options, entries },
              pagination_updated_index: index
            } = await getEntriesPaginationData(direction, service_pagination_req_param)

            response = <GystEntryPaginationResponseSuccess> {
              service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id,
              entries, service_response, pagination_data: { index, options }, warning: undefined
            }
          }
        }
        catch(e) {
          const error_detail = commonErrorDetailGenerator(e)
          response = <GystEntryPaginationResponseError> {
            service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id, 
            error: error_detail
          }
        }
        
        this.respond(response)
      })
    )
  }
}