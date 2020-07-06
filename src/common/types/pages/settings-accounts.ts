import { ServiceSetting, SettingValue } from "~/src/common/types/common/suite"
import { OAuthConnectedUser } from "~/src/common/types/models/oauth-connected-user"
export { OAuthConnectedUser } from "~/src/common/types/models/oauth-connected-user"

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
export type ServiceSettings = ServiceSetting[]

export type State = {
  oauth_infos:OAuthInfos
  service_settings:ServiceSettings
  oauth_connected_accounts:OAuthConnectedUser[]
}