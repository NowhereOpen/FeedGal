import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import moment from "moment"
import * as _ from "lodash"

import { getParam, gystEntriesFromResponse, iterateLoadStatus } from "~/src/cli/store/loader"
import * as RssStorage from "~/src/cli/store/loader/rss-indexeddb"

// Types
import {
  LoadStatus,
  LoadStatusServiceSetting,
  LoadStatusSettingValue,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  ServicePaginationReqParam,
  SuiteEntry,
  SuiteEntryIdObject,
  SuiteEntryCache,
  GystEntryWrapper as GystEntryWrapperType
} from "~/src/common/types/pages/main"
import { Rss } from "~/src/common/setting-value-validation/validation-object"

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
   * 2020-07-13 12:45
   * 
   * Store pagination data and entries in response. The entries here
   * will be used for "loading at least X feeds from each suite entry"
   * and the feeds loaded in this way will be removed from the
   * `preloaded_entries`. Then the rest of entries will be loaded from
   * the `preloaded_entries`.
   * 
   * Refer to `https://github.com/chulman444/feedgal-issues-test/issues/1`
   */
  // Derived from `load_status`
  suite_entries_cache:SuiteEntryCache[] = []

  @Mutation
  deriveSuiteEntriesCache() {
    iterateLoadStatus(this.load_status, (service_setting:LoadStatusServiceSetting, setting_value?:LoadStatusSettingValue) => {
      const suite_entry:SuiteEntryCache = {
        service_id: service_setting.service_id,
        oauth_connected_user_entry_id: service_setting.oauth_info?.user_info?.entry_id,
        service_setting_id: service_setting._id,
        pagination_data: undefined,
        entries: []
      }

      if(setting_value) {
        suite_entry.setting_value_id = setting_value._id
        suite_entry.setting_value = setting_value.value
      }

      this.suite_entries_cache.push(suite_entry)
    })
  }

  @Mutation
  mutateLoadStatus([suite_entry_ids, cb]:[SuiteEntryIdObject, Function]) {
    const service_setting = this.load_status.find(entry => entry._id == suite_entry_ids.service_setting_id)!
    const setting_value = service_setting.setting_values.find(entry => entry._id == suite_entry_ids.setting_value_id)
    if(service_setting.uses_setting_value == true && suite_entry_ids.setting_value_id) {
      cb(setting_value, service_setting)
    }
    else {
      cb(service_setting)
    }
  }

  @Mutation
  mutateCache([suite_entry_ids, cb]:[SuiteEntryIdObject, Function]) {
    const cache = this.suite_entries_cache.find(entry => {
      return entry.service_setting_id == suite_entry_ids.service_setting_id &&
        entry.setting_value_id == suite_entry_ids.setting_value_id
    })!
    cb(cache)
  }

  @Mutation
  mutateEntries(cb:(args:Store) => void) {
    /**
     * 2020-07-13 15:51
     * 
     * Would love to pass only the `preloaded_entries` and `loaded_entries`, but
     * when reassigning with the output of `concat`, things don't work as expected.
     */
    cb(this)
  }

  get isLoadStatusEmpty() {
    return () => this.load_status.length == 0
  }
}