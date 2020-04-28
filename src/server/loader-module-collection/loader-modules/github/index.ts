import {
  OAuthContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"

import { TokenFail, isAxiosError } from "~/src/gyst/server/lib/service-module-helper/refresh-token-if-fail"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { getPaginationData } from "./pagination-data"
import { GetGithubServiceResponse } from "./get-service-response"

export class ContentService extends OAuthContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  async getCredentials() {
    return getCredential(this.oauth_connected_user_entry_id)
  }

  async getOAuthServiceResponse():Promise<any> {
    const pagination_req_data = this.getServiceResponseParams()

    const user_name:string = this.oauth_connected_user.service_user_id
    const branch_name:string = "master"
    const repo_name:string = this.setting_value

    const req_param = { user_name, branch_name, repo_name }

    const task = new GetGithubServiceResponse(this.credentials, req_param, pagination_req_data)
    try {
      return await task.run()
    }
    catch(e) {
      /**
       * 2020-03-22 22:26
       * 
       * One way to recreate 401 error is to revoke the access from the github website (`https://github.com/settings/applications`)
       * and trying to use this. This gives 401 error.
       * 
       * Also, if what's said in `2020-01-01 23:48` is true than it SHOULD throw `TokenFail` error for 404 error because it requires
       * the user to reconnect the oauth account.
       * 
       * 2020-01-01 23:48
       * 
       * Github uses the same access token for refreshing. So, if the token is not valid (401) error, and
       * `refreshTokenIfFail` attempts to refresh it, Github throws 404 error. Which I just understand
       * as that the token used in "refresh token request" doesn't exist.
       * 
       * So, not throwing `TokenFail` error.
       */
      if(isAxiosError(e, 401)) throw new TokenFail(e)
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    return getPaginationData(this.pagination_index, this.pagination_value)
  }
}