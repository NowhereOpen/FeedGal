import { PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"

export type GystEntryResponseSearchableKeys = {
  // `gyst_suite_id` is null for default gyst entries
  // gyst_suite_id:string|null
  // `service_setting_id:null` for made up gyst entries like "default gyst" entries.
  service_setting_id?:string
  setting_value_id?:string
}

export type GystEntryResponseBase = GystEntryResponseSearchableKeys & {
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
  setting_value:any
}

export type GystEntryInitResponseSuccess = GystEntryResponseBase & {
  entries:Entry[]
  pagination_data:PaginationData
  service_response?: any
}

export type GystEntryPaginationResponseSuccess = GystEntryResponseSearchableKeys & {
  entries:Entry[]
  pagination_data:PaginationData
  service_response?: any
}

/**
 * 2020-05-05 09:45 
 * 
 * Same structure as `GystEntryPaginationResponseSuccess` but without the two big data
 * which are the entries and service response
 */
export type ServicePaginationReqParam = GystEntryResponseBase & {
  pagination_data:PaginationData
}