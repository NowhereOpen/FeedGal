import { ExpressRequest } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/base"
import { refreshTokenIfFail } from "~/src/server/method-collection/common"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

export class GetDisconnectServiceRequestHandler extends ExpressRequest {
  oauth_connected_user_entry_id!:string
  oauth_connected_user_entry!:any
  service_id!:string

  async storeParams() {
    this.oauth_connected_user_entry_id = this.req.params.oauth_connected_user_entry_id
    this.oauth_connected_user_entry = await oauth_connected_user_storage.getEntry(this.oauth_connected_user_entry_id)
    this.service_id = this.oauth_connected_user_entry.service_id
  }

  async doTasks() {
    let data
    
    await refreshTokenIfFail(this.service_id, this.oauth_connected_user_entry_id, async (token_data) => {
      const response = await cred_module_collection[this.service_id].revokeToken(token_data)
      /**
       * 2020-06-16 00:06
       * 
       * Feels too heavy to have another suite of oauth handler or something for each oauth service
       * just because twitter (and more services?) doesn't return something that's consistent among
       * other services
       */
      if(this.service_id != "twitter") {
        data = response.data
      }
      else {
        data = response
      }
    })

    await oauth_access_token_storage.invalidateAccessToken(this.service_id, this.oauth_connected_user_entry_id)
    const updated_access_token_entry = await oauth_access_token_storage.getAccessTokenEntry(this.service_id, this.oauth_connected_user_entry_id)
    const disconnect_result = await oauth_connected_user_storage.disconnect(this.oauth_connected_user_entry_id)
    
    this.res_data = {
      revoke_result: data,
      updated_access_token_entry,
      disconnect_result
    }
  }
}