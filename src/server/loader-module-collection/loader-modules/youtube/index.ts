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
import {  } from "./lib/validate-setting-value"

export class YouTubeLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const date_range = {
      from_moment: moment().subtract(7, "days"),
      to_moment: moment()
    }

    return getEntries(param.token_data.access_token, date_range)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam, direction:PaginationDirection) {
    const date_range = {
      from_moment: moment(pagination_value.from_moment),
      to_moment: moment(pagination_value.to_moment)
    }
    return getEntries(param.token_data.access_token, date_range)
  }
}