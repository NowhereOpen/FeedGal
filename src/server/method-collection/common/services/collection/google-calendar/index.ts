import moment from "moment"

import { getEntries } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GoogleCalendarSettingValueValidation } from "./lib/validate-setting-value"
import { getDisplayedSettingValue } from "./lib/get-displayed-setting-value"
import { isSettingValueError } from "./lib/is-setting-value-error"

// Types
import { MethodsOAuth } from "../../base/types"

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const access_token:string = getAccessToken(token_data)
      const default_range = {
        from: moment().startOf("week"),
        to: moment().endOf("week"),
      }
      return await getEntries(access_token, setting_value.id, default_range)
    },
    async getEntriesPagination(token_data, pagiantion_param) {
      const { pagination_value, setting_value } = pagiantion_param!
      const date_range = {
        from: moment(pagination_value.from),
        to: moment(pagination_value.to)
      }
      const access_token:string = getAccessToken(token_data)
      return await getEntries(access_token, setting_value.id, date_range)
    },
    getServiceInfo() {
      return service_info
    },
    getDisplayedSettingValue(setting_value) {
      return getDisplayedSettingValue(setting_value)
    },
    isSettingValueError(e:any) {
      return isSettingValueError(e)
    },
    async validateSettingValue(token_data:any, setting_value:any) {
      const access_token:string = getAccessToken(token_data)
      return await new GoogleCalendarSettingValueValidation(access_token, setting_value).getResult()
    }
  }

  return methods
}

function getAccessToken(token_data:any) {
  const access_token = token_data["access_token"]
  return access_token
}