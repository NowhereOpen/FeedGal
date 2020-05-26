import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import moment from "moment"
import * as _ from "lodash"

import {
  GystEntryResponseGeneralError,
  ServicesPaginationReqData,
  PaginationData,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryPaginationResponse,
  PaginationReqDataSuccess,
  GystEntryPaginationResponseSuccess,
  PaginationReqData
} from "~/src/common/types/gyst-entry"
import { GystEntryWrapper as GystEntryWrapperType } from "~/src/cli/types/gyst-entry"
import { PaginationDirection } from "~/src/server/loader-module-collection/loader-module-base/types"

@Module({
  name: "loader",
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  loaded_entries:any[] = []
  preloaded_entries:any[] = []
  old_entries:any[] = []

  earliest_old_datetime = null
  oldest_loaded_datetime = null
  
  // Pagination storage
  services_pagination_req_data:ServicesPaginationReqData = []

  /**
   * 2020-05-25 18:39
   * 
   * `load-status` isn't required apparently. Data is injected with "server side data injection" then
   * updating status is done with fields of components (ServeSettingStatus, SettingValueStatus)
   * instead of requiring storages.
   * 
   * Should be implemented here when it's better to have Mutation methods and stuff for cleaner code.
   */

  @Mutation
  loadFromPreloadedStorage() {
    const entries = this.preloaded_entries.splice(0, 10)
    this.loaded_entries = this.loaded_entries.concat(entries)
  }

  @Mutation
  concatToPreloadedStorage(response:any) {
    const entries = gystEntriesFromResponse(response)
    this.preloaded_entries = this.preloaded_entries.concat(entries)
    
    // Sort entries in chronological order
    this.preloaded_entries.sort((a,b) => moment(b.entry.datetime_info).isAfter(moment(a.entry.datetime_info)) ? 1 : -1)
  }

  /**
   * 2020-05-25 18:26
   * 
   * https://vuex.vuejs.org/guide/getters.html#method-style-access
   * 
   * > You can also pass arguments to getters by returning a function.
   */
  get getPaginationReqData() {
    /**
     * Filter out services whose service id is 'too old'.
     */
    return (direction:PaginationDirection) => {
      return this.services_pagination_req_data.filter(entry => {
        return "error" in entry == false
      })
    }
  }

  get isLoadedEmpty() {
    return this.loaded_entries.length == 0
  }

  get isPreloadedEmpty() {
    return this.preloaded_entries.length == 0
  }

  @Mutation
  loadWithInit(response:GystEntryResponse) {
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

  @Mutation
  loadWithPagination(response:GystEntryPaginationResponse) {
    if("error" in response) {

    }
    else {
      const target_index = this.services_pagination_req_data.findIndex(entry => {
        return (
          entry.service_setting_id == response.service_setting_id &&
          entry.setting_value_id == response.setting_value_id
        )
      })

      // Update a value of an object
      const target_req_data = this.services_pagination_req_data[target_index]

      if("error" in target_req_data) {
        delete target_req_data.error
      }

      ;(<PaginationReqDataSuccess> target_req_data).pagination_data = response.pagination_data
    }
  }
}

function gystEntriesFromResponse(response:any) {
  if("error" in response) return [];

  const entries = (<GystEntryResponseSuccess>response).entries
  const wrapper_entries = entries.map(entry => (<GystEntryWrapperType> {
    pagination_index: response.pagination_data.index,
    entry
  }))

  return wrapper_entries
}