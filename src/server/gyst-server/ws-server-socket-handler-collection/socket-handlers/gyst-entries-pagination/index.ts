import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { getEntriesPagination } from "~/src/server/loader-module-method-collection/get-entries-pagination"

export class GystEntriesWithPaginationSocketHandler extends SessionSocketEventHandler {
  handleImpl() {
    const target_service_id:null|string = this.req.service_id
    const services_pagination_req_data:any = this.req.pagination_req_data

    const direction = this.req.direction

    getEntriesPagination(this.user_id!, direction, services_pagination_req_data, async (data) => {
      this.socket.emit("gyst-entries-with-pagination-response", data)
    })
  }
}