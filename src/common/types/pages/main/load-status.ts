import {
  GystEntryResponseErrorDetails,
  PaginationData,
  GystEntryWarning
} from "./loader"
import {
  ServiceSetting,
  SettingValue
} from "~/src/common/types/common/suite"

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

export type LoadStatusServiceSetting = Omit<ServiceSetting, "setting_values"> & ClientSideField & {
  service_name:string

  // Overrides
  setting_values: LoadStatusSettingValue[]
}
export type LoadStatusSettingValue = SettingValue & ClientSideField
export type LoadStatus = LoadStatusServiceSetting[]