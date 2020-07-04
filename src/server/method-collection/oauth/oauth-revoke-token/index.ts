import { OAuthMethodBase } from "../base/oauth-method-base"

import { cred_module_collection } from "~/src/server/cred-module-collection"

export class RevokeToken extends OAuthMethodBase {
  async runImpl(token_data:any) {
    const response = await cred_module_collection[this.oauth_service_id].revokeToken(token_data)

    let revoke_result
    if(this.oauth_service_id != "twitter") {
      /**
       * 2020-07-04 10:50
       * 
       * In case of non-twitter services, revoking token returns AxiosResponse type. When this is sent
       * as response, this results in `TypeError: Converting circular structure to JSON` error.
       * 
       * Currently used in `disconnect-post` and `user-delete` only. When there comes a use case that
       * requires the output of this method not be modified, change so later.
       */
      revoke_result = response.data
    }
    else {
      revoke_result = response
    }

    return revoke_result
  }
}