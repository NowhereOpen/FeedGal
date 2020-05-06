import { BaseLoaderModule }  from "./base"
import {
  OAuthGetEntriesInitParam,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam,
} from "./types"

export abstract class OAuthBaseLoaderModule<T=any> extends BaseLoaderModule<
  T,
  OAuthGetEntriesInitParam,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
> {}