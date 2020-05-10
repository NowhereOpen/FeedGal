import { NonOAuthLoaderModule } from "../../loader-module-base/base"
import {
  NonOAuthGetEntriesInitParam,
  PaginationDirection,
  NonOAuthPaginationParam,
  NonOAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import { getDisplayedSettingValue } from "./lib/get-displayed-setting-value"
import {  } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { LeagueOfLegendsSettingValueValidation } from "./lib/validate-setting-value"

export type LeagueOfLegendsCredential = string

export class LeagueOfLegendsLoaderModule extends NonOAuthLoaderModule<LeagueOfLegendsCredential> {
  constructor(api_key:LeagueOfLegendsCredential) {
    super(api_key, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(setting_value:NonOAuthGetEntriesInitParam) {
    return {
      entries:[],
      pagination_options: { new: "", old: "" },
      service_response: {}
    }
  }

  async getEntriesPagination(direction:PaginationDirection, pagination_updated_index:number, param:NonOAuthPaginationParam) {
    return {
      entries:[],
      pagination_options: { new: "", old: "" },
      service_response: {}
    }
  }

  async validateSettingValue(param:NonOAuthValidateSettingValueParam) {
    const task = new LeagueOfLegendsSettingValueValidation(this.static_credential_data, param.setting_value)
    return await task.getResult()
  }

  getDisplayedSettingValue(setting_value:any) {
    return getDisplayedSettingValue(setting_value)
  }
}