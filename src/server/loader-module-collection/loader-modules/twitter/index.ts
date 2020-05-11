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

export type TwitterStaticCredentialData = {
  consumer_key:string, consumer_secret:string
}

export class TwitterLoaderModule extends OAuthBaseLoaderModule<TwitterStaticCredentialData> {
  constructor(static_credential_data:TwitterStaticCredentialData) {
    super(static_credential_data, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const cred = getTwitterCred(this.static_credential_data, param.token_data)
    return getEntries(cred)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam, direction:PaginationDirection) {
    let pagination_param
    if(direction == "old") {
      pagination_param = { max_id: pagination_value }
    }
    else if(direction == "new") {
      pagination_param = { since_id: pagination_value }
    }

    const cred = getTwitterCred(this.static_credential_data, param.token_data)
    const output = await getEntries(cred, pagination_param)

    if(direction == "old") {
      output.entries.shift()
    }

    return output
  }
}

function getTwitterCred(static_data:TwitterStaticCredentialData, token_data:any) {
  const user_cred = {
    access_token_key: token_data.oauth_token,
    access_token_secret: token_data.oauth_token_secret
  }
  return Object.assign(user_cred, static_data)
}