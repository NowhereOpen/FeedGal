import moment from "moment"

import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
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
    return getEntries(access_token, param.setting_value, pagination_value)
  }

  async validateSettingValue(param:OAuthValidateSettingValueParam) {
    const access_token = param.token_data["access_token"]
    const task = new GoogleCalendarSettingValueValidation(access_token, param.setting_value)
    return await task.getResult()
  }
}