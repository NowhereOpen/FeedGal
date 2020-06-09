import { NonOAuthLoaderModule } from "../../loader-module-base/base"
import {
  NonOAuthGetEntriesInitParam,
  PaginationDirection,
  NonOAuthPaginationParam,
  NonOAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
import {  } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import {  } from "./lib/validate-setting-value"

export type DarkSkyCredential = string

export class DarkSkyLoaderModule extends NonOAuthLoaderModule<DarkSkyCredential> {
  constructor(api_key:DarkSkyCredential) {
    super(api_key, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit({ setting_value }:NonOAuthGetEntriesInitParam) {
    return {
      entries:[],
      pagination_data: { new: "", old: "" },
      service_response: {}
    }
  }

  async getEntriesPaginationImpl(pagination_value:any, param:NonOAuthPaginationParam) {
    return {
      entries:[],
      pagination_data: { new: "", old: "" },
      service_response: {}
    }
  }
}