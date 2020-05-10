import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
import { getEntriesInit, getEntriesPagination } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GithubSettingValueValidation } from "./lib/validate-setting-value"

export class GithubLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    return {
      entries:[],
      pagination_options: { new: "", old: "" },
      service_response: {}
    }
  }

  async getEntriesPagination(direction:PaginationDirection, pagination_updated_index:number, param:OAuthPaginationParam) {
    return {
      entries:[],
      pagination_options: { new: "", old: "" },
      service_response: {}
    }
  }

  async validateSettingValue(param:OAuthValidateSettingValueParam) {
    const access_token = ""
    const task = new GithubSettingValueValidation(access_token, param.setting_value)
    return await task.getResult()
  }
}