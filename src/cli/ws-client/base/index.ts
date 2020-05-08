import io from "socket.io-client"

import { PaginationDirection } from "~/src/common/types/gyst-entry"

export abstract class WSClient {
  socket:SocketIOClient.Socket = <any> null

  message_prefix:string

  constructor(message_prefix:string) {
    this.message_prefix = message_prefix
  }

  setup() {
    this.socket = io()
    
    this.socket.on(`${this.message_prefix}-init-response`, this.onGystEntriesResponse.bind(this))
    this.socket.on(`${this.message_prefix}-with-pagination-response`, this.onGystEntriesWithPaginationResponse.bind(this))
  }

  abstract onGystEntriesResponse(gyst_entries:any):void
  abstract onGystEntriesWithPaginationResponse(gyst_entries:any):void

  loadInitEntries(params?:any) {
    // this.socket.emit("service-infos")
    this.socket.emit(`${this.message_prefix}-init`, params)
  }

  abstract getPaginationReqData(direction:PaginationDirection):any
  loadEntriesWithPagination(direction:PaginationDirection) {
    const pagination_req_data = this.getPaginationReqData(direction)
    this.socket!.emit(`${this.message_prefix}-with-pagination`, { direction, pagination_req_data })
  }
}