import {
  OAuthContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { GetTwitterServiceResponse } from "./get-service-response"

export class ContentService extends OAuthContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  async getCredentials() {
    return getCredential(this.oauth_connected_user_entry_id)
  }

  async getOAuthServiceResponse():Promise<any> {
    const pagination_req_data = this.getServiceResponseParams()

    const task = new GetTwitterServiceResponse(this.credentials, this.pagination_value, pagination_req_data)
    try {
      return await task.run()
    }
    catch(e) {
      /**
       * Twitter doesn't have refreshToken and doesn't expire.
       * 
       * When invalid access token it returns response 200 status,
       * `[ { code: 215, message: 'Bad Authentication data.' } ]` data.
       */
      // if(isAxiosError(e, 401)) throw new TokenFail(e)
      throw e
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    const tweets = service_response
    return {
      new: tweets[0].id_str,
      old: tweets.slice(-1)[0].id_str
    }
  }
}