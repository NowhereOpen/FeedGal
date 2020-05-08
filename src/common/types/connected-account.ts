/**
 * Used in `/settings/user`
 */

export type ServiceSettingTarget = {
  gyst_suite_id:string
  gyst_suite_name:string
  service_setting_id:string
  service_setting_service_id:string
  service_setting_service_name:string
  service_setting_alias:string
}

export type ConnectedServiceAccount = {
  oauth_connected_user_entry_id:string
  service_user_id:string
  service_friendly_name:string
  connected_at:string
  privacy_setting:string
  used_in:ServiceSettingTarget[]
  is_signup:boolean
  error_with_access_token:boolean
}

export type ServiceAndAccount = {
  oauth_service_id:string
  oauth_service_name:string
  accounts: ConnectedServiceAccount[]
}