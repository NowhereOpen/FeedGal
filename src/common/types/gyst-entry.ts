import { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
export { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"

export type GystHttpRequestErrorName =
  "DEV_ERROR" |
  "INVALID_NEW_OAUTH_ACCOUNT" |
  "SETTING_VALUE_VALIDATION_ERROR" |
  "INVALID_GYST_LOGIN" |
  "MUST_BE_ANON_USER" |
  "MUST_BE_LOGGED_IN" |
  "DUPLICATE_LOGIN_METHOD" |
  "DISALLOWED_ACTION" |
  "OAUTH_CONNECTED_USER_NOT_EXIST" |
  "INVALID_NEW_GYST_LOGIN"

export type GystHttpRequestError = {
  error: {
    name:GystHttpRequestErrorName
    message:string
    data?:any
  }
}

export type LoadEntryParam = {
  // `gyst_suite_id` is null for default gyst entries
  // gyst_suite_id:string|null
  // `service_setting_id:null` for made up gyst entries like "default gyst" entries.
  
  // 2020-06-01 14:38 I forgot why service_setting_id can be optional (`?`)
  service_setting_id?:string
  setting_value_id?:string
}

export type LoadEntryParamDetail = LoadEntryParam & {
  service_id:string
  
  /**
    * 2020-03-15 20:15
    * 
    * The server doesn't know how to get access token for oauth services just with
    * `ServicesPaginationData`.
    * 
    * ... Or could use service_setting_id for the key in `ServicesPaginationData`?
    * 
    * 2020-03-21 16:56
    * 
    * `null` when the service doesn't use oauth
    */
  oauth_connected_user_entry_id: string|undefined
  setting_value?:any
}

export type GystEntryError = "NO_SETTING_VALUES" | "NO_SERVICE_SETTINGS" | "DEV_FAULT" |
  "INVALID_SETTING_VALUE" | "ERROR_ON_REFRESH_TOKEN" | "OAUTH_CONNECTED_USER_NOT_EXIST"

export type GystEntryResponseErrorDetails = {
  name: GystEntryError
  message: string
  data: any
}

export type PaginationReqDataError = LoadEntryParamDetail & {
  error: GystEntryResponseErrorDetails
}
export type PaginationReqDataSuccess = LoadEntryParamDetail & {
  pagination_data: PaginationData
}
/**
 * 2020-03-21 15:39
 * Sent by the server, stored on the client, included in the pagination request
 */
export type PaginationReqData = PaginationReqDataError | PaginationReqDataSuccess

export type ArrPaginationReqData = PaginationReqData[]

export type GystEntryResponseGeneralError = {
  error: GystEntryResponseErrorDetails
}

export type GystEntryResponseSuccess = LoadEntryParamDetail & {
  entries:Entry[]
  pagination_data:PaginationData
  service_response?: any
}

export type GystEntryResponseError = LoadEntryParamDetail & {
  error: GystEntryResponseErrorDetails
}

export type GystEntryResponse = GystEntryResponseSuccess | GystEntryResponseError

export type GystEntryPaginationResponseSuccess = LoadEntryParamDetail & {
  entries:Entry[]
  pagination_data:PaginationData
  service_response?: any
}
export type GystEntryPaginationResponseError = LoadEntryParamDetail & {
  error: GystEntryResponseErrorDetails
}

export type GystEntryPaginationResponse = GystEntryPaginationResponseSuccess | GystEntryPaginationResponseError

/**
 * 2020-05-05 09:45 
 * 
 * Same structure as `GystEntryPaginationResponseSuccess` but without the two big data
 * which are the entries and service response
 */
export type ServicePaginationReqParam = LoadEntryParamDetail & {
  pagination_data:PaginationData
}