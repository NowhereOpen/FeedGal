import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import moment from "moment"
import { DurationInputObject } from "moment"
import * as _ from "lodash"

import {
  LoadStatus,
  LoadStatusByServiceSetting,
  LoadStatusServiceSetting,
  LoadStatusSettingValue
} from "~/src/common/types/loader"
import {
  GystEntryResponseGeneralError,
  ArrPaginationReqData,
  PaginationData,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryPaginationResponse,
  PaginationReqDataSuccess,
  GystEntryPaginationResponseSuccess,
  PaginationReqData,
  LoadEntryParam
} from "~/src/common/types/gyst-entry"
import { GystEntryWrapper as GystEntryWrapperType } from "~/src/cli/types/gyst-entry"
import { PaginationDirection } from "~/src/server/loader-module-collection/loader-module-base/types"

/**
 * 2020-05-31 07:38
 * 
 * Needs to be a storage. I did this with event emitting and event bus while keeping the
 * 'states' as a component field/variable. Working with events weren't fun.
 * 
 * I had to do it because there is 'load controller' and/or 'load state' that shows
 * whether entries for certain service is waiting for the response or not. That's why I
 * need either the Vuex or the event emitting.
 * 
 * What I don't like about Vuex is that even with `vuex-module-decorator`, I can't
 * define a method that can be used 'conveniently' within a mutation or something.
 * 
 * These should be defined in the component that uses those methods. For example,  there
 * are methods that load controller doesn't need but loader component does.
 */

const MAX_DURATION_DIFF:DurationInputObject = { days: 2 }
const LOAD_ENTRIES_NUM = 10
const LOAD_OLD_ENTRIES_NUM = 10

function getAllowedDatetimeMoment(datetime:null|moment.Moment) {
  const datetime_moment:moment.Moment = datetime != null ? datetime.clone() : moment()
  const allowed_datetime:moment.Moment = datetime_moment.subtract(moment.duration(MAX_DURATION_DIFF))
  return allowed_datetime
}

function gystEntriesFromResponse(response:GystEntryResponseSuccess | GystEntryPaginationResponseSuccess) {
  if("error" in response) return [];

  const entries = (<GystEntryResponseSuccess>response).entries
  const wrapper_entries = entries.map(entry => (<GystEntryWrapperType> {
    pagination_index: response.pagination_data.index,
    entry,
    load_entry_param_detail: {
      service_setting_id: response.service_setting_id,
      setting_value_id: response.setting_value_id,

      oauth_connected_user_entry_id: response.oauth_connected_user_entry_id,
      service_id: response.service_id,
      setting_value: response.setting_value,
    }
  }))

  return wrapper_entries
}

function getParam(load_entry_param:LoadEntryParam, load_status:LoadStatus) {
  const service_setting_id = load_entry_param.service_setting_id
  const setting_value_id = load_entry_param.setting_value_id

  const param = load_status.find(param => param.service_setting_id == service_setting_id && param.setting_value_id == setting_value_id)!
  return param
}

@Module({
  name: "loader",
  namespaced: true,
  stateFactory: true
})
export default class Store extends VuexModule {
  loaded_entries:GystEntryWrapperType[] = []
  preloaded_entries:GystEntryWrapperType[] = []

  /**
   * 2020-05-25 18:23
   * 
   * Refer to Server side data injection
   */
  load_status:LoadStatus = []

  oldest_loaded_datetime:moment.Moment|null = null
  
  // Pagination storage
  services_pagination_req_data:ArrPaginationReqData = []

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
    const entries:GystEntryWrapperType[] = []
    const allowed_datetime = getAllowedDatetimeMoment(this.oldest_loaded_datetime)

    for(let a=0; a < this.preloaded_entries.length; a++) {
      const entry = this.preloaded_entries[a]
      const moment_datetime_info = moment(entry.entry.datetime_info)

      /**
       * 2020-05-28 15:41
       * 
       * Need to update `oldest_loaded_datetime` in `loadFromPreloadedStorage` because there can be
       * entries that weren't loaded in the previous or init entries because it was too old, but the
       * currently date range is okay for these entries to be loaded, AND the datetime of this entry
       * is the `oldest_loaded_datetime`.
       */
      if(moment_datetime_info.isSameOrAfter(allowed_datetime)) {
        entries.push(entry)
        this.preloaded_entries.splice(a, 1)
        a--
      }

      if(entries.length >= LOAD_ENTRIES_NUM) {
        break
      }
    }

    this.loaded_entries = this.loaded_entries.concat(entries)
  }

  /**
   * 2020-05-26 16:37
   * 
   * Loads 'old entries'. This method is not automatically triggered when the
   * main page hits the bottom of the page.
   */
  @Mutation
  forceLoadFromPreloadedStorage() {
    const entries:GystEntryWrapperType[] = []
    const allowed_datetime = getAllowedDatetimeMoment(this.oldest_loaded_datetime)

    for(let a=0; a < this.preloaded_entries.length; a++) {
      const entry = this.preloaded_entries[a]
      const moment_datetime_info = moment(entry.entry.datetime_info)

      if(moment_datetime_info.isBefore(allowed_datetime)) {
        entries.push(entry)
        this.preloaded_entries.splice(a, 1)
        a--
      }

      if(entries.length >= LOAD_OLD_ENTRIES_NUM) {
        break
      }
    }

    this.loaded_entries = this.loaded_entries.concat(entries)
  }

  @Mutation
  concatToPreloadedStorage(response:GystEntryResponseSuccess | GystEntryPaginationResponseSuccess) {
    const entries = gystEntriesFromResponse(response)

    /**
     * 2020-05-27 16:11
     * 
     * Update the `oldest_loaded_datetime`. Let's say there is a datetime range A, B, C
     * where A and C are too old, so the oldest entry in A and latest entry in C are
     * `MAX_DURATION_DIFF` apart, the `oldest_loaded_datetime` will then be the datetime
     * of the oldest entry in A.
     * 
     * If service Foo returns entries with datetime range A and C, then A will be loaded
     * from preloaded storage and C will be considered "too old". If service Bar returns
     * entries with datetime range B LATER, then the entries from Foo of datetime range
     * C will be loaded from preloaded data properly.
     * 
     * So, the `oldest_loaded_datetime` can be updated everytime response is retrieved.
     */
    entries.forEach(entry => {
      const allowed_datetime_head:moment.Moment = getAllowedDatetimeMoment(this.oldest_loaded_datetime)
      const oldest_loaded_datetime:moment.Moment = this.oldest_loaded_datetime || moment()
      const moment_datetime_info = moment(entry.entry.datetime_info)

      if(moment_datetime_info.isSameOrAfter(allowed_datetime_head) && moment_datetime_info.isBefore(oldest_loaded_datetime)) {
        this.oldest_loaded_datetime = moment_datetime_info
      }
    })

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
      const allowed_datetime:moment.Moment = getAllowedDatetimeMoment(this.oldest_loaded_datetime)
      const service_old_entries:{ [service_id:string]:number } = {}

      /**
       * 2020-05-28 16:55 
       * 
       * Need to consider "old entries count threshold". For example, Google Calendar returns an event that's 'all day' and
       * is very long with datetime that of the start date of the event. This event will be considered 'old' by GYST. Without
       * the "old entries count threshold", google calendar entries will not be loaded when pagiantion request occurs.
       */
      const OLD_ENTRIES_COUNT_THRESHOLD = 5

      this.preloaded_entries.forEach(entry => {
        const moment_datetime_info = moment(entry.entry.datetime_info)
        const service_id = entry.entry.service_id

        if(moment_datetime_info.isBefore(allowed_datetime)) {
          service_old_entries[service_id] = (service_old_entries[service_id] || 0) + 1
        }
      })

      const pagination_req_data = this.services_pagination_req_data.filter(entry => {
        const service_id = entry.service_id
        const has_old_entries = service_id in service_old_entries
        return "error" in entry == false && has_old_entries ? service_old_entries[service_id] < OLD_ENTRIES_COUNT_THRESHOLD : true
      })

      return pagination_req_data
    }
  }

  get load_status_by_service_setting():LoadStatusByServiceSetting {
    const load_status:LoadStatusByServiceSetting = []
    this.load_status.forEach(param => {
      let service_setting = load_status.find(entry => entry.service_setting_id == param.service_setting_id)

      if(service_setting == null) {
        const _service_setting:LoadStatusServiceSetting = {
          service_id: param.service_id,
          service_name: param.service_name,
          service_setting_id: param.service_setting_id!,
          is_disabled: param.is_disabled,
          is_loading: param.is_loading,
          // Will be added later
          total: 0,
          error: param.error,
        }

        service_setting = _service_setting
        load_status.push(service_setting)
      }
      
      if(param.setting_value_id) {
        const setting_value:LoadStatusSettingValue = {
          setting_value_id: param.setting_value_id,
          value: param.setting_value,
          displayed_as: param.displayed_as,
          is_invalid: param.is_invalid,
          is_loading: param.is_loading,
          total: param.total,
          error: param.error,
        }

        if(service_setting.setting_values == null) {
          service_setting.setting_values = [setting_value]
        }
        else {
          service_setting.setting_values!.push(setting_value)
        }
      }

      service_setting.total += param.total
    })

    return load_status
  }

  get isAllLoaded() {
    return () => this.load_status.every(status => status.is_loading == false)
  }

  get getPaginationReqDataForLoadEntryParam() {
    return (load_entry_param:LoadEntryParam) => {
      const fields:Array<keyof LoadEntryParam> = ["service_setting_id", "setting_value_id"]
      const pagination_req_data = this.services_pagination_req_data.find(req_data => fields.every(field => req_data[field] == load_entry_param[field]))
      return [pagination_req_data]
    }
  }

  get oldEntriesExist() {
    return () => this.preloaded_entries.some(entry => moment(entry.entry.datetime_info).isBefore(getAllowedDatetimeMoment(this.oldest_loaded_datetime)))
  }

  get getOldEntries() {
    return () => this.preloaded_entries.filter(entry => moment(entry.entry.datetime_info).isBefore(getAllowedDatetimeMoment(this.oldest_loaded_datetime)))
  }

  get isLoadedEmpty() {
    return this.loaded_entries.length == 0
  }

  get onlyOldEntriesExist() {
    return () => this.preloaded_entries.every(entry => moment(entry.entry.datetime_info).isBefore(getAllowedDatetimeMoment(this.oldest_loaded_datetime)))
  }

  get isEnoughPreloaded() {
    const MIN_PRELOADED_COUNT = 10
    return (load_entry_param:LoadEntryParam) => {
      let count = 0

      return this.preloaded_entries.some(entry => {
        const detail = entry.load_entry_param_detail
        if(detail.service_setting_id == load_entry_param.service_setting_id && detail.setting_value_id == load_entry_param.setting_value_id) {
          count++
        }

        return count >= MIN_PRELOADED_COUNT
      })
    }
  }

  /**
   * Check if last entry returned empty response or error. If yes, return false
   * if not, return true. There are different types of errors and flags that this
   * function can handle.
   */
  get canLoadMore() {
    return (load_entry_param:LoadEntryParam) => {
      const param = getParam(load_entry_param, this.load_status)
      return param.last_loaded_entries_total != null && param.last_loaded_entries_total > 0
    }
  }

  @Mutation
  updateIsLoading(payload:{ param:LoadEntryParam, value:boolean }) {
    const { value, param } = payload
    const param_instance = getParam(param, this.load_status)
    param_instance.is_loading = value
  }

  @Mutation
  updateStatus(response:GystEntryResponse|GystEntryPaginationResponse) {
    const param = getParam(response, this.load_status)!
    if("error" in response) {
      param.error = response.error
    }
    else {
      const total_entries = response.entries.length
      param.last_loaded_entries_total = total_entries
      param.total += total_entries
    }

    param.is_loading = false
  }

  @Mutation
  updatePaginationReqDataWithInit(response:GystEntryResponse) {
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
  updatePaginationReqDataWithPagination(response:GystEntryPaginationResponse) {
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