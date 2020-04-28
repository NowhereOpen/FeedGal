import {
  OAuthContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { GetTrelloServiceResponse } from "./get-service-response"

export class ContentService extends OAuthContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  async getCredentials() {
    return getCredential(this.oauth_connected_user_entry_id)
  }
  
  async getOAuthServiceResponse():Promise<any> {
    const pagination_req_data = this.getServiceResponseParams()
    const task = new GetTrelloServiceResponse(this.credentials, this.pagination_value, pagination_req_data)
    try {
      return await task.run()
    }
    catch(e) {
      /**
       * Trello doesn't have end point for refreshing tokens
       * 
       * https://developers.trello.com/page/authorization
       * 
       * Only the revoke action is available.
       */
      // if(isAxiosError(e, 401)) throw new TokenFail(e)
      throw e
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    const entries = service_response
    return {
      old: entries.slice(-1)[0].id,
      new: entries[0].id
    }
  }
}