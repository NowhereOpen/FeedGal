import { 
  LoadEntryParamDetail,
  GystEntryResponseErrorDetails,
  PaginationData,
  GystEntryWarning
} from "./gyst-entry"

export type ClientSideField = {
  /**
   * `Default: true`
   */
  is_loading: boolean
  total: number

  pagination_data?: PaginationData
  error?: GystEntryResponseErrorDetails
  warning?: GystEntryWarning
}

import {
  ServiceSetting,
  SettingValue
} from "~/src/common/types/common/gyst-suite"

export type LoadStatusSettingValue = SettingValue & ClientSideField
export type LoadStatusServiceSetting = Omit<ServiceSetting, "setting_values"> & ClientSideField & {
  // Service Setting
  service_name:string
  is_disabled:boolean

  // Setting Value
  displayed_as?:string
  is_invalid?:boolean

  // Overrides
  setting_values: LoadStatusSettingValue[]
}

export type LoadStatus = LoadStatusServiceSetting[]