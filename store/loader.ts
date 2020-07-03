import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import moment from "moment"
import * as _ from "lodash"

import { getParam, gystEntriesFromResponse, iterateLoadStatus } from "~/src/cli/store/loader"

// Types
import {
  LoadStatus,
  LoadStatusServiceSetting,
  LoadStatusSettingValue
} from "~/src/common/types/pages/main"
import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  ServicePaginationReqParam,
  LoadEntryParam,
} from "~/src/common/types/pages/main"
import { ServiceInfo } from "~/src/common/types/common/service-info"
import { GystEntryWrapper as GystEntryWrapperType } from "~/src/common/types/pages/main"

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

const LOAD_ENTRIES_NUM = 10
const LOAD_OLD_ENTRIES_NUM = 10

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
  // Injected
  load_status:LoadStatus = []

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

    for(let a=0; a < this.preloaded_entries.length; a++) {
      const entry = this.preloaded_entries[a]
      entries.push(entry)
      this.preloaded_entries.splice(a, 1)

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

    for(let a=0; a < this.preloaded_entries.length; a++) {
      const entry = this.preloaded_entries[a]

      entries.push(entry)
        this.preloaded_entries.splice(a, 1)
        a--

      if(entries.length >= LOAD_OLD_ENTRIES_NUM) {
        break
      }
    }

    this.loaded_entries = this.loaded_entries.concat(entries)
  }

  @Mutation
  concatToPreloadedStorage(response:GystEntryResponseSuccess) {
    const entries = gystEntriesFromResponse(response)

    this.preloaded_entries = this.preloaded_entries.concat(entries)
    
    // Sort entries in chronological order
    this.preloaded_entries.sort((a,b) => moment(b.entry.datetime_info).isAfter(moment(a.entry.datetime_info)) ? 1 : -1)
  }

  get isLoadStatusEmpty() {
    return () => this.load_status.length == 0
  }

  get isAllLoaded() {
    return () => this.load_status.every(status => {
      if(status.uses_setting_value) {
        return status.setting_values.every(setting_value => {
          return setting_value.is_loading == false || setting_value.is_invalid || setting_value.error
        })
      }
      else {
        return status.is_loading == false || status.oauth_info?.user_info?.is_error || status.error
      }
    })
  }

  get getPaginationReqDataForLoadEntryParam() {
    return (load_entry_param:LoadEntryParam):ServicePaginationReqParam => {
      const { service_setting_id, setting_value_id } = load_entry_param
      const service_setting = this.load_status.find(entry => entry._id == service_setting_id)!
      const setting_value = service_setting.setting_values.find(entry => entry._id == setting_value_id)

      const pagination_req_data:ServicePaginationReqParam = {
        oauth_connected_user_entry_id: service_setting.oauth_info?.user_info?.entry_id,
        pagination_data: (service_setting.pagination_data || setting_value?.pagination_data)!,
        service_id: service_setting.service_id,
        service_setting_id,
        setting_value_id,
        setting_value: setting_value?.value,
        warning: service_setting.warning || setting_value?.warning
      }

      return pagination_req_data
    }
  }

  get isLoadedEmpty() {
    return this.loaded_entries.length == 0
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

  get getParam() {
    return (load_entry_param:LoadEntryParam) => {
      return getParam(load_entry_param, this.load_status)
    }
  }

  @Mutation
  async startLoading() {
    await iterateLoadStatus(this.load_status, async (service_setting:LoadStatusServiceSetting, setting_value?:LoadStatusSettingValue) => {
      service_setting.is_loading = true
      if(setting_value) {
        setting_value.is_loading = true
      }
    })
  }

  @Mutation
  updateIsLoading(payload:{ param:LoadEntryParam, value:boolean }) {
    const { value, param } = payload
    const param_instance = getParam(param, this.load_status)
    param_instance.is_loading = value
  }

  @Mutation
  updateStatus(response:GystEntryResponse) {
    const param = getParam(response, this.load_status)!
    if("error" in response) {
      param.error = response.error
    }
    else {
      const total_entries = response.entries.length
      param.total += total_entries
    }

    param.is_loading = false

    const service_setting = <LoadStatusServiceSetting> getParam({ service_setting_id: response.service_setting_id }, this.load_status)!
    if(service_setting.uses_setting_value) {
      const all_loaded = service_setting.setting_values.every(setting_value => setting_value.is_loading == false)
      if(all_loaded) {
        service_setting.is_loading = false
      }
    }
  }

  @Mutation
  updatePaginationReqData(response:GystEntryResponse) {
    const param = getParam(response, this.load_status)
    if("error" in response) {
      const _response = <GystEntryResponseError> response
      param.error = _response.error
    }
    else {
      param.pagination_data = response.pagination_data
      if("warning" in response) {
        param.warning = response.warning
      }
      else {
        delete param.warning
      }
      delete param.error
    }
  }
}