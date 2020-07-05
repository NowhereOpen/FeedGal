import { RemoveDataBase } from "../common/remove-data"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Methods
import { RevokeToken } from "~/src/server/method-collection"

/**
 * 2020-06-21 07:18 
 * 
 * Handling revoking a valid account and removing an invalid or 'error' account that's been
 * revoked outside of FeedGal in this one endpoint for now.
 */
export class GetDisconnectServiceRequestHandler extends RemoveDataBase<
  { revoke_result: any },
  { setting_values_results: any[], service_setting_result: any },
  { disconnect_result: any }
> {
  oauth_connected_user_entry_id!:string
  oauth_connected_user_entry!:any
  oauth_service_id!:string

  async storeParams() {
    this.oauth_connected_user_entry_id = this.req.params.oauth_connected_user_entry_id
    this.oauth_connected_user_entry = await oauth_connected_user_storage.getEntry(this.oauth_connected_user_entry_id)
    this.oauth_service_id = this.oauth_connected_user_entry.service_id
  }

  async handleAccessToken0() {
    /**
     * 2020-07-04 09:57
     * 
     * Adding this comment because it confused me when I get back to this code.
     * 
     * Remove vs revoke. The user can revoke an account and when the user requests for it, we revoke and remove the
     * associated account tied to the user.
     * 
     * When there had been an error but user revoked the authorization from outside service, we can't use the token.
     * However we shouldn't remove the associated account because the user hasn't requested for it. We just mark it
     * as an error and wait for the user to request to 'remove' it.
     */
    const is_remove = await oauth_connected_user_storage.isErrorWithOAuthUserEntryId(this.oauth_connected_user_entry_id)
    const is_revoke = is_remove == false
    
    let revoke_result
    if(is_revoke) {
      const param = {
        oauth_service_id : this.oauth_service_id,
        oauth_user_entry_id: this.oauth_connected_user_entry_id
      }

      await new RevokeToken(param).run(async (e, result) => {
        if(e) {
          /**
           * 2020-07-04 10:02
           * 
           * Do nothing when an error occurs because the associated because we will remove and invalidate associated
           * suite entry, token, and oauth connected user entries anyways.
           */
        }
        revoke_result = result
      })
    }

    const updated_access_token_entry = await oauth_access_token_storage.getAccessTokenEntry(this.oauth_service_id, this.oauth_connected_user_entry_id)
    await oauth_access_token_storage.invalidateAccessToken(this.oauth_service_id, this.oauth_connected_user_entry_id)

    return { revoke_result }
  }

  async handleServiceSetting1() {
    const service_settings = await service_setting_storage.getAllServiceSettingsForOAuthConnectedUserEntryId(this.oauth_connected_user_entry_id)
    const service_setting_ids = service_settings.map(entry => entry._id)

    const setting_values_results:any[] = []
    await Promise.all(
      service_setting_ids.map(async service_setting_id => {
        const result = await setting_value_storage.clearServiceSettingSettingValueValues(service_setting_id)
        setting_values_results.push(result)
      })
    )

    const service_setting_result = await service_setting_storage.deleteOAuthUser(this.oauth_connected_user_entry_id)

    return { service_setting_result, setting_values_results }
  }

  async handleConnectedAccount2() {
    const disconnect_result = await oauth_connected_user_storage.disconnect(this.oauth_connected_user_entry_id)
    return {
      disconnect_result
    }
  }

  async doTasks() {
    const remove_data_result = await this.removeData()
    
    this.res_data = { remove_data_result }
  }
}