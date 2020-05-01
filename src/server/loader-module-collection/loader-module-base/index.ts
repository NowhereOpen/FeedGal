import { ServiceInfo } from "./service-info"
import { refreshTokenIfFail } from "../../lib/service-module-helper/refresh-token-if-fail"
import { handleCache } from "../../lib/service-module-helper/handle-cache"

import { oauth_connected_user_storage } from "~/src/models/oauth-connected-user"

export { ServiceInfo } from "./service-info"

import { GetServiceResponsePaginationParam } from "./get-service-response"
import {
  GystEntry,
  PaginationReqDataSuccess,
  PaginationDirection,
  PaginationOptions
} from "~/src/gyst/common/types/gyst-entry"

export type ContentServiceResult = {
  gyst_entries:GystEntry[]
  pagination_options:PaginationOptions
  service_response:any
}

/**
 * As an 'overview' of the `ContentService`.
 * 
 * Abstract class so that when `ContentService` is missing methods it throws syntax error.
 */
interface IContentService {
  // Abstract or functions with default behavior that can/should be overriden
  getCredentials():Promise<any>|any
  getServiceInfo():ServiceInfo
  getServiceResponse(setting_value?:any):Promise<any>
  formatToGystEntries(service_response:any):GystEntry[]
  getPaginationOption(service_response:any):PaginationOptions

  // Implemented in ContentService
  useGetServiceResponse(setting_value:any|null):Promise<any>
  
  // Main interfaces
  loadGystEntryResponse(setting_value:any):Promise<void>
  loadGystEntryResponseWithPagination(direction:PaginationDirection, pagination_index:number, pagination_data:PaginationReqDataSuccess):Promise<void>
}

export abstract class ContentServiceBase implements IContentService {
  service_id:string
  credentials:any = undefined
  
  /**
   * 2020-02-29 17:38
   * 
   * Used for getting cache, oauth tokens, etc.
   * 
   * Was used in getting setting values in 2020-w-6 version, but after adding the gyst-suite,
   * this class is no more responsible for it
   */
  user_id!:string

  service_info!:ServiceInfo

  /**
   * 2020-03-15 15:21
   * Pagination index for the currently loading instance. So, for the initial request,
   * it's 0. When this value is `1`, we are loading the older pagination entries from
   * the initial request.
   */
  pagination_index:number = 0
  
  pagination_direction:PaginationDirection|null = null
  pagination_value:any = null
  setting_value:any = null
  pagination_req_data:PaginationReqDataSuccess|null = null

  result!:ContentServiceResult
  
  constructor(service_id:string, credentials?:any) {
    this.service_id = service_id
    this.credentials = credentials
  }

  async loadCredentials() {
    this.credentials = await this.getCredentials()
  }

  /**
   * Surprisingly, each service actually usees different data structure.
   * For example, even for services that use oauth2 authentication, some
   * require access token only (Eg, bitbucket), some services need to
   * extract access token from the response from the oauth2 flow (Eg, github).
   * Some require more than accesss token.
   * 
   * So, having a resolver in this 'base' class will make this function
   * too big. Implement in each subclass.
   */
  abstract getCredentials():Promise<any>|any
  abstract getServiceResponse():Promise<any>
  abstract formatToGystEntries(service_response:any):GystEntry[]
  /**
   * Get pagination data index and value from `this.pagination_data`.
   */
  abstract getPaginationOption(service_response:any):PaginationOptions
  abstract getServiceInfo():ServiceInfo
  
  getCacheSearchFields() {
    return {
      user_id: this.user_id,
      service_id: this.service_id,
      pagination_index: this.pagination_index,
      pagination_value: this.pagination_value,
      setting_value: this.setting_value
    }
  }

  async useGetServiceResponse() {
    const cache_search_fields = this.getCacheSearchFields()
    const service_response = await handleCache(
      cache_search_fields,
      async () => {
        let service_response
        try {
          service_response = await this.getServiceResponse()
        }
        catch(e) {
          console.error(
            "[/getServiceEntriesUseCase]",
            `Error while getting service entries. user_id (${this.user_id}), service_id (${this.service_id}), is_oauth (${this.service_info.is_oauth})`)
          throw e
        }
  
        return service_response
      }
    )

    return service_response
  }

  getServiceResponseParams():GetServiceResponsePaginationParam {
    let  pagination_options = null

    if(this.pagination_req_data != null) {
      pagination_options = this.pagination_req_data.pagination_data.options
    }

    return {
      direction: this.pagination_direction,
      index: this.pagination_index,
      options: pagination_options
    }
  }

  public async loadGystEntryResponse(setting_value:any):Promise<void> {
    this.setting_value = setting_value
    this.service_info = this.getServiceInfo()
    this.loadCredentials()

    let service_response:any = null
    let gyst_entries:GystEntry[] = []
    let pagination_options:PaginationOptions = { new: null, old: null }

    service_response = await this.useGetServiceResponse()
    gyst_entries = this.formatToGystEntries(service_response)
    pagination_options = this.getPaginationOption(service_response)

    console.log(
      `[/getGystEntryResponse]`,
      `Returning total ${gyst_entries.length} gyst entries. user_id (${this.user_id}), service_id (${this.service_id})`
    )

    this.result = {
      gyst_entries,
      service_response,
      pagination_options,
    }
  }

  public async loadGystEntryResponseWithPagination(
    direction:PaginationDirection,
    pagination_index:number,
    pagination_data:PaginationReqDataSuccess
  ):Promise<void> {
    this.pagination_direction = direction
    this.pagination_index = pagination_index
    this.pagination_req_data = pagination_data
    this.pagination_value = this.pagination_req_data.pagination_data.options[direction]

    const setting_value = this.pagination_req_data.setting_value

    /**
     * The other methods will behave with `pagination_data` in mind.
     */
    await this.loadGystEntryResponse(setting_value)
  }
}

export abstract class OAuthContentServiceBase extends ContentServiceBase {
  oauth_connected_user_entry_id:string
  oauth_connected_user!:any

  constructor(service_id:string, user_id:string, oauth_connected_user_entry_id:string) {
    super(service_id, user_id)

    this.oauth_connected_user_entry_id = oauth_connected_user_entry_id
  }

  getCacheSearchFields() {
    const search_fields = super.getCacheSearchFields()
    Object.assign(search_fields, { oauth_connected_user_entry_id: this.oauth_connected_user_entry_id })
    return search_fields
  }

  async getServiceResponse() {
    this.oauth_connected_user = await oauth_connected_user_storage!.getEntry(this.oauth_connected_user_entry_id)

    if(this.oauth_connected_user == null) {
      const error = new Error("Please update the service setting.")
      error.name = "OAUTH_CONNECTED_USER_NOT_EXIST"
      throw error
    }
    
    const oauth_service_id = <string> this.service_info.oauth_service_id
    const entries_response = await refreshTokenIfFail(oauth_service_id, this.oauth_connected_user_entry_id, async () => {
      await this.loadCredentials()
      return this.getOAuthServiceResponse()
    })

    return entries_response
  }

  abstract getOAuthServiceResponse():Promise<any>
}