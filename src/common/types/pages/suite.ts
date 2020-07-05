import { ServiceSetting } from "~/src/common/types/common/suite"
import { EditorSelectable } from "~/src/common/types/common/service-info"

export * from "~/src/common/types/common/service-info"
export * from "~/src/common/types/common/suite"

export type EditorSelectables = EditorSelectable[]
export type SuiteServiceSettings = ServiceSetting[]

export type State = {
  suite_service_settings:SuiteServiceSettings
  editor_selectables:EditorSelectables
}

export type ValidationResult = {
  is_valid: boolean
  setting_value:any
  // When `is_valid == true`
  data?: any
  // When `is_valid == false`
  invalid_reason?: string
}