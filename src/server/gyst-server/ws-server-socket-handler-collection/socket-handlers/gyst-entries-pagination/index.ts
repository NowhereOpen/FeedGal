import _ from "lodash"

// Methods
import { getEntriesInit, getEntriesPagination } from "~/src/server/method-collection"

// Types
import { SuiteEntry } from "~/src/server/method-collection"

import { GetEntriesBaseSocketHandler } from "../../socket-handler-base/get-entries-base"
import { validateOwnerships } from "./validate-ownership"

// Types
import {
  ServicePaginationReqParam
} from "~/src/common/types/pages/main"
import { EntriesResult, PaginationDirection } from "~/src/server/method-collection/common/services/base/types"

export class GystEntriesWithPaginationSocketHandler extends GetEntriesBaseSocketHandler {
  constructor() {
    super("gyst-entries-pagination")
  }

  async getIterable() {
    return this.req.pagination_req_data
  }

  async getEntriesResult(service_pagination_req_param:ServicePaginationReqParam) {
    let entries_result:EntriesResult
    if(_.get(service_pagination_req_param, "warning.name") == "RATE_LIMIT" && service_pagination_req_param.pagination_data == undefined) {
      entries_result = await getEntriesInit(<SuiteEntry> service_pagination_req_param)
    }
    else {
      const direction:PaginationDirection = this.req.direction
      entries_result = await getEntriesPagination(direction, service_pagination_req_param)
    }

    return entries_result
  }

  async onReceiveRequest() {
    super.onReceiveRequest()
    const validate_ownership = await validateOwnerships(this.user_id!, this.req.pagination_req_data)
    if(validate_ownership) {
      // Something weird happened on the client side.
    }
  }
}