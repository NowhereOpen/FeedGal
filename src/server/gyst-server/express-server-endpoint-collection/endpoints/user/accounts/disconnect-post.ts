import { ExpressRequest } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/base"

import { oauth_collection } from "~/src/server/cred-module-collection"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

export class GetDisconnectServiceRequestHandler extends ExpressRequest {
  oauth_connected_user_entry_id!:string
  oauth_connected_user_entry!:any
  service_id!:string
  access_token_entry!:any

  async storeParams() {
    this.oauth_connected_user_entry_id = this.req.params.oauth_connected_user_entry_id
    this.oauth_connected_user_entry = await oauth_connected_user_storage.getEntry(this.oauth_connected_user_entry_id)
    this.service_id = this.oauth_connected_user_entry.service_id
    this.access_token_entry = await oauth_access_token_storage.getAccessTokenEntry(this.service_id, this.oauth_connected_user_entry_id)
  }

  async doTasks() {
    const { data } = await oauth_collection[this.service_id].revokeToken(this.access_token_entry.data)

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