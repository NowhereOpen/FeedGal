import {
  PaginationData,
} from "./loader"
import {
  ServiceSetting,
  SettingValue
} from "~/src/common/types/common/suite"
import { WarningObject, ErrorObject } from "~/src/common/types/common/warning-error"

export type ClientSideField = {
  /**
   * `Default: true`
   */
  is_loading: boolean
  total: number

  pagination_data?: PaginationData
  error?: ErrorObject
  warning?: WarningObject
}

export type LoadStatusServiceSetting = Omit<ServiceSetting, "setting_values"> & ClientSideField & {
  service_name:string

  // Overrides
  setting_values: LoadStatusSettingValue[]
}
export type LoadStatusSettingValue = SettingValue & ClientSideField
export type LoadStatus = LoadStatusServiceSetting[]