import { WSClient } from "~/src/cli/ws-client/base"

import { PaginationDataStorage } from "./pagination-data-storage"

import { PaginationDirection, GystEntryResponse, } from "~/src/common/types/gyst-entry"

export type OnServiceInfosResponse = (service_infos:any) => any
export type OnGystEntriesResponse = (gyst_entries:any) => any
export type OnGystEntriesWithPpaginationResponse = (gyst_entries:any) => any

export type OnGystEntriesPostCb = (gyst_suite_id:string, response:GystEntryResponse) => void

type CallBacks = {
  onServiceInfosResponse:OnServiceInfosResponse
  onGystEntriesResponse:OnGystEntriesResponse
  onGystEntriesWithPaginationResponse:OnGystEntriesWithPpaginationResponse
}

export class GystEntryWSClient extends WSClient {
  pagination_data_storage:PaginationDataStorage = new PaginationDataStorage()

  onGystsEntriesPostCb:(response:GystEntryResponse) => void = () => {}
  onGystEntriesWithPaginationPostCb:(response:GystEntryResponse) => void = () => {}

  setup() {
    super.setup()
  }

  getServiceInfo(cb:OnServiceInfosResponse) {
    this.socket.emit("service-infos", null, cb)
  }

  onGystEntriesResponse(gyst_entries:any) {
    this.onGystsEntriesPostCb(gyst_entries)
  }

  onGystEntriesWithPaginationResponse(gyst_entries:any) {
    this.onGystEntriesWithPaginationPostCb(gyst_entries)
  }
  
  loadInitEntries(gyst_suite_id?:string) {
    super.loadInitEntries({ gyst_suite_id })
  }

  getPaginationReqData(direction:PaginationDirection) {
    return this.pagination_data_storage.services_pagination_req_data.filter(entry => "error" in entry == false)
  }
}