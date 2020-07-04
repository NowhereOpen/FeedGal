import { ServiceSetting } from "~/src/common/types/common/suite"
import { ServiceInfo } from "~/src/common/types/common/service-info"

export * from "~/src/common/types/common/service-info"
export * from "~/src/common/types/common/suite"

export type ServiceSettings = ServiceSetting[]
export type ServiceInfos = ServiceInfo[]
export type State = {
  service_settings:ServiceSettings
  service_infos:ServiceInfos
}

export type ValidationResult = {
  is_valid: boolean
  setting_value:any
  // When `is_valid == true`
  data?: any
  // When `is_valid == false`
  invalid_reason?: string
}