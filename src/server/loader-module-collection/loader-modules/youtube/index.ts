import {
  OAuthContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { GetYouTubeServiceResponse } from "./get-service-response"
import { getPaginationData } from "./pagination-data"
import { isAxiosError, TokenFail } from "~/src/gyst/server/lib/service-module-helper/refresh-token-if-fail"

export class ContentService extends OAuthContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  async getCredentials() {
    return getCredential(this.oauth_connected_user_entry_id)
  }

  async getOAuthServiceResponse():Promise<any> {
    const pagination_req_data = this.getServiceResponseParams()

    const task = new GetYouTubeServiceResponse(this.credentials, this.pagination_value, pagination_req_data)
    try {
      return await task.run()
    }
    catch(e) {
      /**
       * NOT Same as google-calendar.
       * 
       * 401 for invalid access token, 400 for invalid refresh token.
       */
      if(isAxiosError(e, 401)) throw new TokenFail(e)
      throw e
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    return getPaginationData(this.pagination_req_data!.pagination_data.index, this.pagination_req_data!.pagination_data.options)
  }
}