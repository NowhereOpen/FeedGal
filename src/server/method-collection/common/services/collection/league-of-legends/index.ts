import { getEntries } from "./lib/get-entries"
import { LeagueOfLegendsSettingValueValidation } from "./lib/validate-setting-value"
import { isSettingValueError } from "./lib/is-setting-value-error"
import { ServiceInfo } from "./lib/service-info"
import { getDisplayedSettingValue } from "./lib/get-displayed-setting-value"

// Types
import { MethodsNonOAuth } from "../../base/types"

type Cred = { api_key:string }
let cred:Cred

export function setupLeageuOfLegends(api_key:string) {
  cred = { api_key }
}

export function getMethods():MethodsNonOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsNonOAuth = {
    async getEntriesInit(setting_value) {
      return getEntries(cred.api_key, setting_value.region, setting_value.summoner_name)
    },
    async getEntriesPagination(pagiantion_param) {
      const { setting_value, pagination_value } = pagiantion_param!
      return getEntries(cred.api_key, setting_value.region, setting_value.summoner_name, pagination_value)
    },
    getServiceInfo() {
      return service_info
    },
    getDisplayedSettingValue(setting_value) {
      return getDisplayedSettingValue(setting_value)
    },
    isSettingValueError(e) {
      return isSettingValueError(e)
    },
    async validateSettingValue(setting_value) {
      const task = new LeagueOfLegendsSettingValueValidation(cred.api_key, setting_value)
      return await task.getResult()
    }
  }

  return methods
}