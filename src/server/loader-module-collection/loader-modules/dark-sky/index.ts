import { NonOAuthLoaderModule } from "../../loader-module-base/base"
import {
  NonOAuthGetEntriesInitParam,
  PaginationDirection,
  NonOAuthPaginationParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
import {  } from "./lib/get-entries"
import { service_info } from "./lib/service-info"
import {  } from "./lib/validate-setting-value"

export type DarkSkyCredential = string

export class DarkSkyLoaderModule extends NonOAuthLoaderModule<DarkSkyCredential> {
  constructor(api_key:DarkSkyCredential) {
    super(api_key, service_info)
  }

  async getEntriesInit({ setting_value }:NonOAuthGetEntriesInitParam) {
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