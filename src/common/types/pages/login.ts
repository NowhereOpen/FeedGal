import { User as UserInfo } from "../models/user"
export { User as UserInfo } from "../models/user"
export type OAuthInfo = {
  service_id: string
  service_name: string
  total_signup: number
  total_service_connected: number
  total_accounts_connected: number
}
export type OAuthInfos = { [service_id:string]:OAuthInfo }
export type State = {
  user_info:UserInfo
  oauth_infos:OAuthInfos
}