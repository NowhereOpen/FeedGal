import { PaginationData, Entry } from "~/src/server/method-collection/common/services/base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { Warning, Error } from "~/src/common/types/common/warning-error"

export type GystEntryResponseGeneralError = {
  error: Error
}

export type GystEntryResponseSuccess = LoadEntryParamDetail & {
  entries:Entry[]
  // Undefined when there had been a warning
  pagination_data?:PaginationData
  service_response?: any
  warning?: Warning
}

export type GystEntryResponseError = LoadEntryParamDetail & {
  error: Error
}

export type GystEntryResponse = GystEntryResponseSuccess | GystEntryResponseError

export { PaginationData, Entry } from "~/src/server/method-collection/common/services/base/types"
export * from "./request"