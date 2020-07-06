import { ServiceSetting } from "~/src/common/types/common/suite"
import { OAuthConnectedUser as _OAuthConnectedUser } from "~/src/common/types/models/oauth-connected-user"

export type RevokeInfo = {
  url: string
  msg?: string
}

export type OAuthInfo = {
  service_id: string
  service_name: string
  revoke_info: RevokeInfo|undefined
  btn_class: string
  fa_value: string
}
export type OAuthInfos = OAuthInfo[]

export type OAuthConnectedUser = _OAuthConnectedUser & {
  /**
   * 2020-07-06 19:17
   * 
   * Will be (suite, service setting, setting value) triplet array when multiple suites
   * feature is added.
   */
  used_in: ServiceSetting[]
}

export type State = {
  oauth_infos:OAuthInfos
  oauth_connected_accounts:OAuthConnectedUser[]
}