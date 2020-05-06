import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam
} from "../../loader-module-base/types"

import {  } from "./lib/get-displayed-setting-value"
import { getEntriesInit, getEntriesPagination } from "./lib/get-entries"
import { service_info } from "./lib/service-info"
import {  } from "./lib/validate-setting-value"

export class GithubLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, service_info)
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

  async validateSettingValue() { return true }
}