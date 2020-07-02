import { BaseLoaderModule }  from "./base"
import {
  OAuthGetEntriesInitParam,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam,
} from "./types"

export abstract class OAuthBaseLoaderModule<StaticCredentialData=any> extends BaseLoaderModule<
  StaticCredentialData,
  OAuthGetEntriesInitParam,
  OAuthPaginationParam,
  OAuthValidateSettingValueParam
> {}