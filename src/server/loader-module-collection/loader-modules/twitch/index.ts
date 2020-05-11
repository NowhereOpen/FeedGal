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
import {  } from "./lib/validate-setting-value"

export class TwitchLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    return getEntries(param.token_data.access_token, 0)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam) {
    return getEntries(param.token_data.access_token, param.pagination_data.index)
  }
}