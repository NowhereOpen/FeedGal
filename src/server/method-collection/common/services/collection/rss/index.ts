import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"
import { RssSettingValueValidation } from "./lib/validate-setting-value"

import { ALL_LOADED } from "~/src/common/warning-error"

// Types
import { MethodsNonOAuth } from "../../base/types"
import { RssSettingValue } from "~/src/common/types/common/setting-value"

export function getMethods():MethodsNonOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsNonOAuth = {
    async getEntriesInit(setting_value:RssSettingValue) {
      return await getEntries(setting_value)
    },
    async getEntriesPagination(pagination_param) {
      /**
       * 2020-07-10 08:12
       * 
       * RSS pagination relies on the user's client side storage
       */
      return {
        entries:[],
        warning: ALL_LOADED()
      }
    },
    getServiceInfo() {
      return service_info
    },
    validateSettingValue(setting_value) {
      return new RssSettingValueValidation(setting_value).getResult()
    },
    getDisplayedSettingValue(setting_value) {
      return setting_value.title.trim() == "" ? setting_value.original_title : setting_value.title
    }
  }

  return methods
}