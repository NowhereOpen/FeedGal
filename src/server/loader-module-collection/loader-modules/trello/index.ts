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

export type TrelloStaticCredential = string

export class TrelloLoaderModule extends OAuthBaseLoaderModule<TrelloStaticCredential> {
  constructor(consumer_key:TrelloStaticCredential) {
    super(consumer_key, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const trello_cred = { access_token: param.token_data.oauth_token, consumer_key: this.static_credential_data }
    return getEntries(trello_cred)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam, direction:PaginationDirection) {
    const trello_cred = { access_token: param.token_data.oauth_token, consumer_key: this.static_credential_data }
    let pagination_param
    if(direction == "old") {
      pagination_param = { before: pagination_value }
    }
    else if(direction == "new") {
      pagination_param = { since: pagination_value }
    }
    return getEntries(trello_cred, pagination_param)
  }
}