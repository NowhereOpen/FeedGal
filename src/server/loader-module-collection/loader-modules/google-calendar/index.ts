import moment from "moment"

import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
} from "../../loader-module-base/types"

export { isSettingValueError } from "./lib/is-setting-value-error"
import { getEntries } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GoogleCalendarSettingValueValidation } from "./lib/validate-setting-value"

export class GoogleCalendarLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const access_token = param.token_data["access_token"]
    return getEntries(access_token, param.setting_value, {
      from: moment().startOf("week"),
      to: moment().endOf("week"),
    })
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam) {
    const access_token = param.token_data["access_token"]
    const date_range = {
      from: moment(pagination_value.from),
      to: moment(pagination_value.to)
    }
    return getEntries(access_token, param.setting_value, date_range)
  }

  async validateSettingValue(param:OAuthValidateSettingValueParam) {
    const access_token = param.token_data["access_token"]
    const task = new GoogleCalendarSettingValueValidation(access_token, param.setting_value)
    return await task.getResult()
  }
}