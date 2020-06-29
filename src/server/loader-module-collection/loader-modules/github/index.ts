import { OAuthBaseLoaderModule } from "../../loader-module-base/oauth"
import {
  OAuthGetEntriesInitParam,
  PaginationDirection,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
} from "../../loader-module-base/types"

import { getAccessTokenFromTokenResponse } from "~/src/server/lib/loader-module-helpers/services/github"

export { isSettingValueError } from "./lib/is-setting-value-error"
import { getEntries } from "./lib/get-entries"
import { ServiceInfo } from "./lib/service-info"
import { GithubSettingValueValidation } from "./lib/validate-setting-value"
import { getDisplayedSettingvalue } from "./lib/get-displayed-setting-value"
import { getOwnerFromSettingValue } from "./lib/utility"

export class GithubLoaderModule extends OAuthBaseLoaderModule {
  constructor() {
    super(undefined, new ServiceInfo().getServiceInfo())
  }

  async getEntriesInit(param:OAuthGetEntriesInitParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    return getEntries(access_token, getOwnerFromSettingValue(param.setting_value), param.setting_value.repo)
  }

  async getEntriesPaginationImpl(pagination_value:any, param:OAuthPaginationParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    return getEntries(access_token, getOwnerFromSettingValue(param.setting_value), param.setting_value.repo, pagination_value)
  }

  async validateSettingValue(param:OAuthValidateSettingValueParam) {
    const access_token:string = getAccessTokenFromTokenResponse(param.token_data)
    const task = new GithubSettingValueValidation(access_token, param.setting_value)
    const result = await task.getResult()
    return result
  }

  getDisplayedSettingValue(setting_value:any):string {
    const displayed_value = getDisplayedSettingvalue(setting_value)
    return displayed_value
  }
}