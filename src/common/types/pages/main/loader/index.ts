import { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { GystEntryWarning } from "./common"

export type GystEntryError = "NO_SETTING_VALUES" | "NO_SERVICE_SETTINGS" |
  "INVALID_SETTING_VALUE" | "ERROR_ON_REFRESH_TOKEN" |
  /**
   * 2020-07-01 09:00
   * 
   * Token was marked as an error. So the user needs to reconnect the service or something to fix this.
   * Token isn't removed when an error occurs because that can be confusing for user. Instead, mark it as
   * an error. And when using the token, check if it is marked as an error or not.
   */
  "TOKEN_MARKED_ERROR"

/**
 * 2020-06-18 17:30 
 * 
 * Because this type has `name` and `message` this can be javascript Error object friendly.
 */
export type GystEntryResponseErrorDetails = {
  name: GystEntryError
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
  warning?: GystEntryWarning
}

export type GystEntryResponseError = LoadEntryParamDetail & {
  error: GystEntryResponseErrorDetails
}

export type GystEntryResponse = GystEntryResponseSuccess | GystEntryResponseError

export { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
export * from "./common"
export * from "./request"