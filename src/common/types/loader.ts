import { LoadEntryParamDetail } from "./gyst-entry"

type ClientSideField = {
  /**
   * `Default: true`
   */
  is_loading: boolean
  total: number

  error?: any
  flag?: any
}

export type LoadEntryParamInstance = LoadEntryParamDetail & ClientSideField & {
  // Set on the client side
  pagination_index: number|null
  last_loaded_entries_total: number|null

  // Service Setting
  service_name:string
  is_disabled:boolean

  // Setting Value
  displayed_as?:string
  is_invalid?:boolean
}

export type LoadStatus = LoadEntryParamInstance[]

export type LoadStatusSettingValue = ClientSideField & {
  setting_value_id:string
  value:any
  displayed_as?:string
  is_invalid?:boolean
}
export type LoadStatusServiceSetting = ClientSideField & {
  service_id:string
  service_name:string
  service_setting_id:string
  is_disabled:boolean

  setting_values?: LoadStatusSettingValue[]
}
export type LoadStatusByServiceSetting = LoadStatusServiceSetting[]