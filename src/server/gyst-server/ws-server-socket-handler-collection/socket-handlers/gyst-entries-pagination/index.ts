import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { getEntriesPagination } from "~/src/server/method-collection/get-entries-pagination"
import { ServicePaginationReqParam } from "~/src/common/types/responses"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

export class GystEntriesWithPaginationSocketHandler extends SessionSocketEventHandler {
  async handleImpl() {
    const target_service_id:null|string = this.req.service_id
    const services_pagination_req_data:ServicePaginationReqParam[] = this.req.pagination_req_data

    const direction = this.req.direction

    /**
     * 2020-05-05 10:10
     * 
     * May need to check the ownership of `this.user_id` and the `oauth_connected_user_entry_id`
     * in the `services_pagination_req_data`. The client could definitely make a request after
     * modifying the `oauth_connected_user_entry_id` in the `services_pagination_req_data` even
     * when the owner of the entry_id is not logged in.
     */

    const ownerships = await Promise.all(
      services_pagination_req_data.map(async data => {
        if(data.oauth_connected_user_entry_id) {
          return validateOwnership(this.user_id!, data.oauth_connected_user_entry_id)
        }
        return true
      })
    )

    if(ownerships.every(entry => entry == true) == false) {
      // Something weird happened on the client side.
    }

    getEntriesPagination(direction, services_pagination_req_data, async (data) => {
      this.socket.emit("gyst-entries-with-pagination-response", data)
    })
  }
}

async function validateOwnership(target_user_id:string, oauth_connected_user_entry_id:string):Promise<boolean> {
  const entry = await oauth_connected_user_storage.getEntry(oauth_connected_user_entry_id)
  const user_id = entry!.get("user_id")

  return user_id == target_user_id
}