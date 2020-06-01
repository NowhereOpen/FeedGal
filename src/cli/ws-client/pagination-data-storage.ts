import * as _ from "lodash"

import {
  ArrPaginationReqData,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponse,
  PaginationReqData,
  PaginationReqDataSuccess,
  PaginationReqDataError,
} from "~/src/common/types/gyst-entry"

export class PaginationDataStorage {
  services_pagination_req_data:ArrPaginationReqData
  
  constructor() {
    this.services_pagination_req_data = []
  }

  public loadWithInit(response:GystEntryResponse) {
    if("error" in response) {
      const _response = <GystEntryResponseError> response
      this.services_pagination_req_data.push(_response)
    }
    else {
      const data = _.cloneDeep(response)
      delete data.entries
      delete data.service_response

      this.services_pagination_req_data.push(data)
    }
  }

  public loadWithPagination(response:GystEntryResponse) {
    if("error" in response) {

    }
    else {
      const target_index = this.services_pagination_req_data.findIndex(entry => {
        return (
          entry.service_setting_id == response.service_setting_id &&
          entry.setting_value_id == response.setting_value_id
        )
      })

      const target_req_data = this.services_pagination_req_data[target_index]

      if("error" in target_req_data) {
        delete target_req_data.error
      }

      ;(<PaginationReqDataSuccess> target_req_data).pagination_data = response.pagination_data
    }
  }
}