import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import { getAccessTokenFromTokenResponse } from "~/src/server/lib/loader-module-helpers/services/github"

import {  } from "./lib/get-displayed-setting-value"
import { getEntries } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GithubSettingValueValidation } from "./lib/validate-setting-value"

export class GithubLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    return getEntries(access_token, param.setting_value)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    return getEntries(access_token, param.setting_value, pagination_value)
  }

  async validateSettingValue(param:OAuthValidateSettingValueParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    const task = new GithubSettingValueValidation(access_token, param.setting_value)
    const result = await task.getResult()
    console.log(`github loader module avlidatSettingValue result: `,result)
    return result
  }
}