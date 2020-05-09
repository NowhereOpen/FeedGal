import { NonOAuthLoaderModule } from "../../loader-module-base/base"
import {
  NonOAuthGetEntriesInitParam,
  PaginationDirection,
  NonOAuthPaginationParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
import {  } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import {  } from "./lib/validate-setting-value"

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

  async validateSettingValue() { return true }
}