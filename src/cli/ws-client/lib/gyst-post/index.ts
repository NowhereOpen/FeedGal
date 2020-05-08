import { WSClient } from "~/src/cli/ws-client/base"

import { PaginationDirection } from "~/src/common/types/gyst-entry"

export class GystPostWSClient extends WSClient {
  onInitPostCb:(response:any) => void = () => {}
  onPaginationPostCb:(response:any) => void = () => {}

  onGystEntriesResponse(response:any) {
    this.onInitPostCb(response)
  }

  onGystEntriesWithPaginationResponse(response:any) {
    this.onPaginationPostCb(response)
  }
  
  loadInitEntries() {
    super.loadInitEntries()
  }

  getPaginationReqData(direction:PaginationDirection) {
    return {}
  }
}