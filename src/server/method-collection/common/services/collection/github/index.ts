import { getEntries } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GithubSettingValueValidation } from "./lib/validate-setting-value"
import { getDisplayedSettingValue } from "./lib/get-displayed-setting-value"
import { isSettingValueError } from "./lib/is-setting-value-error"

import { getAccessTokenFromTokenResponse } from "~/src/server/lib/loader-module-helpers/services/github"
import { getOwnerFromSettingValue } from "./lib/utility"

// Types
import { MethodsOAuth } from "../../base/types"

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const access_token:string = getAccessTokenFromTokenResponse(token_data)
      const owner = getOwnerFromSettingValue(setting_value)
      return await getEntries(access_token, owner, setting_value.repo)
    },
    async getEntriesPagination(token_data, pagiantion_param) {
      const { pagination_value, setting_value } = pagiantion_param!
      const access_token:string = getAccessTokenFromTokenResponse(token_data)
      const owner = getOwnerFromSettingValue(setting_value)
      return await getEntries(access_token, owner, setting_value.repo, pagination_value)
    },
    getServiceInfo() {
      return service_info
    },
    getDisplayedSettingValue(setting_value:any) {
      return getDisplayedSettingValue(setting_value)
    },
    isSettingValueError(e:any) {
      return isSettingValueError(e)
    },
    async validateSettingValue(token_data:any, setting_value:any) {
      const access_token:string = getAccessTokenFromTokenResponse(token_data)
      return await new GithubSettingValueValidation(access_token, setting_value).getResult()
    }
  }

  return methods
}