export type LoadEntryParam = {
  // `gyst_suite_id` is null for default gyst entries
  // gyst_suite_id:string|null
  // `service_setting_id:null` for made up gyst entries like "default gyst" entries.
  
  // 2020-06-01 14:38 I forgot why service_setting_id can be optional (`?`)
  service_setting_id?:string
  setting_value_id?:string
}

export type LoadEntryParamDetail = LoadEntryParam & {
  service_id:string
  
  /**
    * 2020-03-15 20:15
    * 
    * The server doesn't know how to get access token for oauth services just with
    * `ServicesPaginationData`.
    * 
    * ... Or could use service_setting_id for the key in `ServicesPaginationData`?
    * 
    * 2020-03-21 16:56
    * 
    * `null` when the service doesn't use oauth
    */
  oauth_connected_user_entry_id?: string
  setting_value?:any
}