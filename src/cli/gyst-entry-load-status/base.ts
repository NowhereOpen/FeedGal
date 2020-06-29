import Vue from "vue"
import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseGeneralError,
  PaginationData
} from "~/src/common/types/pages/main"

export abstract class Loadable extends Vue {
  total_loaded:number = 0
  /**
   * 2020-03-21 20:45
   * 
   * Not setting `is_loading = false` in`handleDataResponse` or before calling it
   * because it can get complex. For example, a service setting that uses
   * setting value requires all the setting values be loaded for its `is_loading`
   * to be false.
   */
  is_loading:boolean|null = null
  /**
   * 2020-03-21 20:47
   * 
   * Store actual error details in the subclass.
   */
  is_error:boolean = false

  /**
   * 2020-03-15 22:16
   * 
   * `null` when there was an error.
   * 
   * 2020-03-15 21:58
   * 
   * `null` if the service setting `uses_setting_value == true` OR
   * `uses_setting_value == false` and there had been an error while loading
   */
  pagination_index:number|null = null
  pagination_data:PaginationData|null = null

  abstract startLoading():void
  updateStatus(response:GystEntryResponse):void {
    if("error" in response) {
      this.is_error = true

      if(["NO_SERVICE_SETTINGS"].includes(response.error.name)) {
        this.handleGeneralErrorResponse(<GystEntryResponseGeneralError> response)
      }
      else if(["OAUTH_CONNECTED_USER_NOT_EXIST", "NO_SETTING_VALUES", "INVALID_SETTING_VALUE", "ERROR_ON_REFRESH_TOKEN", "DEV_FAULT"].includes(response.error.name)) {
        this.handleErrorResponse(<GystEntryResponseError> response)
      }
    }
    else {
      this.handleDataResponse(response)
    }
  }
  abstract handleErrorResponse(response:GystEntryResponseError):void
  abstract handleDataResponse(response:GystEntryResponseSuccess):void
  /**
   * Override if needed
   */
  handleGeneralErrorResponse(response:GystEntryResponseGeneralError) {}
  abstract isAllLoaded():boolean
}