import { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { GystEntryWarning } from "./common"

export type GystEntryError = "NO_SETTING_VALUES" | "NO_SERVICE_SETTINGS" | "DEV_FAULT" | "DEV_FAULT_MSG" |
  "INVALID_SETTING_VALUE" | "ERROR_ON_REFRESH_TOKEN" | "OAUTH_CONNECTED_USER_NOT_EXIST" |
  /**
   * 2020-06-18 17:11
   * 
   * I don't like the name of this error. Had to come up with new something better ... or different than
   * `OAUTH_CONNECTED_USER_NOT_EXIST` or `ERROR_ON_REFRESH_TOKEN`. So there is uncertainty among some
   * error names, and `TOKEN_ERROR` isn't an exception.
   * 
   * Need to work on removing and reworking error names.
   */
  "TOKEN_ERROR"

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