import { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { ErrorName, Warning } from "~/src/common/types/common/warning-error"

/**
 * 2020-06-18 17:30 
 * 
 * Because this type has `name` and `message` this can be javascript Error object friendly.
 */
export type GystEntryResponseErrorDetails = {
  name: ErrorName
  message: string
  data: any
}

export type GystEntryResponseGeneralError = {
  error: GystEntryResponseErrorDetails
}

export type GystEntryResponseSuccess = LoadEntryParamDetail & {
  entries:Entry[]
  // Undefined when there had been a warning
  pagination_data?:PaginationData
  service_response?: any
  warning?: Warning
}

export type GystEntryResponseError = LoadEntryParamDetail & {
  error: GystEntryResponseErrorDetails
}

export type GystEntryResponse = GystEntryResponseSuccess | GystEntryResponseError

export { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
export * from "./request"