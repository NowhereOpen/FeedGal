export type ValidationResult = {
  is_valid: boolean
  setting_value:any
  // When `is_valid == true`
  res_data?: any
  // When `is_valid == false`
  error_message?: string
}

export type GystSuite = {
  _id:string
  gyst_suite_name:string
  is_default:boolean
  is_public:boolean
  total_settings:number
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
}

export type ServiceSetting = {
  _id:string
  service_id:string
  service_name:string
  alias:string|undefined
  resource_name:string
  setting_values:SettingValue[]

  is_oauth:boolean
  uses_setting_value:boolean
  is_disabled:boolean

  // Exists only when  `is_oauth` is true
  oauth_info?: {
    oauth_id:string,
    is_connected:boolean

    // Exists only when `is_connected` is true
    user_info?: OAuthUserInfo
  }
}