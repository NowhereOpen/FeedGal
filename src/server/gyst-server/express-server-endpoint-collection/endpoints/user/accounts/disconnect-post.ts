import { ExpressRequest } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/base"
import { refreshTokenIfFailOAuthServiceId } from "~/src/server/method-collection/common/refresh-token-if-fail"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

/**
 * 2020-06-21 07:18 
 * 
 * Handling revoking a valid account and removing an invalid or 'error' account that's been
 * revoked outside of FeedGal in this one endpoint for now.
 */
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
    /**
     * 2020-06-21 07:23
     * 
     * Checking whether it's supposed to be a remove action using a query instead of using
     * data in request just because.
     */
    const is_remove = await oauth_connected_user_storage.isErrorWithOAuthUserEntryId(this.oauth_connected_user_entry_id)
    
    let revoke_result
    if(is_remove == false) {
      revoke_result = this.revoke()
    }

    await oauth_access_token_storage.invalidateAccessToken(this.service_id, this.oauth_connected_user_entry_id)
    const updated_access_token_entry = await oauth_access_token_storage.getAccessTokenEntry(this.service_id, this.oauth_connected_user_entry_id)
    const disconnect_result = await oauth_connected_user_storage.disconnect(this.oauth_connected_user_entry_id)
    const service_settings = await service_setting_storage.getAllServiceSettingsForConnectedUser(this.oauth_connected_user_entry_id)
    const service_setting_result = await service_setting_storage.deleteOAuthUser(this.oauth_connected_user_entry_id)
    const setting_values_result:any = {}
    await Promise.all(
      service_settings.map(async service_setting => {
        const id = service_setting._id
        const result = await setting_value_storage.clearServiceSettingSettingValueValues(id)
        setting_values_result[id] = result
      })
    )
    
    this.res_data = {
      revoke_result,
      updated_access_token_entry,
      disconnect_result,
      service_setting_result,
      setting_values_result
    }
  }

  async revoke() {
    let revoke_result
    await refreshTokenIfFailOAuthServiceId(this.service_id, this.oauth_connected_user_entry_id, async (token_data) => {
      const response = await cred_module_collection[this.service_id].revokeToken(token_data)
      /**
       * 2020-06-16 00:06
       * 
       * Feels too heavy to have another suite of oauth handler or something for each oauth service
       * just because twitter (and more services?) doesn't return something that's consistent among
       * other services
       */
      if(this.service_id != "twitter") {
        revoke_result = response.data
      }
      else {
        revoke_result = response
      }
    })

    return revoke_result
  }
}