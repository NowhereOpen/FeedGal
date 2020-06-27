export type OAuthConnectedUser = {
  _id:string
  displayed_account_name:string
}

export type ServiceInfoOAuthInfo = {
  service_id: string
  service_name: string
  is_connected: boolean
  oauth_connected_users: OAuthConnectedUser[]
}

export type ServiceInfo = {
  service_id:string
  name:string
  is_oauth:boolean
  oauth_service_id:string|null
  uses_setting_value:boolean
  oauth?: ServiceInfoOAuthInfo
}