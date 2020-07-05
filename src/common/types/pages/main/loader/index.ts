import { PaginationData, Entry } from "~/src/server/method-collection/common/services/base/types"
import { SuiteEntry } from "~/src/common/types/common/suite"
import { WarningObject, ErrorObject } from "~/src/common/types/common/warning-error"

export type SuiteEntryIdObject = { service_setting_id:string, setting_value_id?:string }

export type GystEntryResponseGeneralError = {
  error: ErrorObject
}

export type GystEntryResponseSuccess = SuiteEntry & {
  entries:Entry[]
  // Undefined when there had been a warning
  pagination_data?:PaginationData
  service_response?: any
  warning?: WarningObject
}

export type GystEntryResponseError = SuiteEntry & {
  error: ErrorObject
}

export type GystEntryResponse = GystEntryResponseSuccess | GystEntryResponseError

export { PaginationData, Entry } from "~/src/server/method-collection/common/services/base/types"
export * from "./request"