export type Suite = {
  _id:string
  gyst_suite_name:string
  is_default:boolean
  is_public:boolean
  total_settings:number
}

export type SuiteEntry = {
  service_id:string
  service_setting_id:string
  oauth_connected_user_entry_id?:string
  setting_value_id?:string
  setting_value?:any
}

export type SettingValue = {
  _id:string
  displayed_as:string
  value:any
  is_invalid:boolean
}

export type OAuthUserInfo = {
  entry_id:string
  user_id:string
  friendly_name:string
  user_uid:string
  is_error?:boolean
}

export type ServiceSetting = {
  _id:string
  service_id:string
  service_name:string
  alias:string|undefined
  resource_name:string
  setting_values:SettingValue[]

  is_oauth:boolean
  /**
   * 2020-07-06 20:41
   * Very important property because having 0 setting values and `uses_setting_value = false`
   * are different. Refer to three different cases for showing where the oauth account is used
   * in `/settings/accounts` revoke/remove dialog. (1) service not used at all (2) no
   * associated setting values, and (3) display where it's used. 
   */
  uses_setting_value:boolean

  // Exists only when  `is_oauth` is true
  oauth_info?: {
    oauth_id:string,
    is_connected:boolean

    // Exists only when `is_connected` is true
    user_info?: OAuthUserInfo
  }
}