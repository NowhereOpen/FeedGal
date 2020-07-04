import { OAuthMethodBase } from "../base/oauth-method-base"

import { cred_module_collection } from "~/src/server/cred-module-collection"

export class ValidateOAuthAccount extends OAuthMethodBase {
  async runImpl(token_data:any) {
    const user_info = await cred_module_collection[this.oauth_service_id].getUserInfo(token_data)
    /**
     * 2020-07-04 09:33
     * 
     * Returns nothing. Rely on whether this throws error or not.
     */

    return true
  }
}