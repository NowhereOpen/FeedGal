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

export type RedditStaticCredential = string

export class RedditLoaderModule extends OAuthBaseLoaderModule<RedditStaticCredential> {
  constructor(user_agent:RedditStaticCredential) {
    super(user_agent, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const reddit_cred = { access_token: param.token_data.access_token, user_agent: this.static_credential_data }
    return getEntries(reddit_cred, 0)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam, direction:PaginationDirection) {
    const reddit_cred = { access_token: param.token_data.access_token, user_agent: this.static_credential_data }
    let pagination_param
    if(direction == "old") {
      pagination_param = { after: pagination_value }
    }
    else if(direction == "new") {
      pagination_param = { before: pagination_value }
    }
    return getEntries(reddit_cred, param.pagination_data.index, pagination_param)
  }
}