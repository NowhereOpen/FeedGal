import {
  OAuthContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { getPaginationData } from "./pagination-data"
import { GetGoogleCalendarServiceResponse } from "./get-service-response"
import { getAccessTokenCommon } from "~/src/models/oauth-access-token"
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
    const task = new GetGoogleCalendarServiceResponse(this.credentials, this.pagination_value, pagination_req_data)
    try {
      return await task.run()
    }
    catch(e) {
      // 400 when invalid refresh token

      /**
       * I don't understand when it's 403 and when it's 401
       */
      if(isAxiosError(e, 403) || isAxiosError(e, 401)) throw new TokenFail(e)

      throw e
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    return getPaginationData(this.pagination_req_data!.pagination_data.options[this.pagination_direction!])
  }
}