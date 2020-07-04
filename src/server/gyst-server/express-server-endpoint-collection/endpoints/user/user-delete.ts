import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Methods
import { RevokeToken } from "~/src/server/method-collection/oauth"
import { getServiceInfo } from "~/src/server/method-collection"

// Types
import { ServiceInfo } from "~/src/server/method-collection/common/services/base/types"

export class DeleteUserRequestHandler extends SessionRequestHandlerBase {
  storeParams():void|Promise<void> {}

  async doTasks():Promise<void> {
    const revoke_results:any[] = []
    const setting_values_result:any[] = []
    
    await iterateServiceSettings(this.user_id!, async (service_setting, service_info) => {
      const service_id = service_setting.get("service_id")
      const service_setting_id = service_setting._id

      if(service_info.uses_setting_value) {
        const result = await setting_value_storage.clearServiceSettingSettingValueValues(service_setting_id)
        setting_values_result.push({
          service_setting_id, service_id, result
        })
      }
    })
    
    const service_settings_result = await service_setting_storage.deleteUser(this.user_id!)

    await iterateConnectedAccounts(this.user_id!, async (connected_account) => {
      const oauth_service_id = connected_account.get("service_id")
      const oauth_user_entry_id = connected_account._id
      const result = this.revoke(oauth_service_id, oauth_user_entry_id)
      revoke_results.push({ oauth_service_id, oauth_user_entry_id, result })
      await oauth_access_token_storage.deleteEntry(oauth_service_id, oauth_user_entry_id)
    })

    const oauth_connected_user_result = await oauth_connected_user_storage.deleteUser(this.user_id!)
    
    const remove_user_result = await gyst_user_storage.deleteUser(this.user_id!)

    this.logout()

    this.res_data = {
      service_settings_result,
      setting_values_result,
      revoke_results,
      oauth_connected_user_result,
      remove_user_result,
    }

    console.log(this.res_data)
  }

  async revoke(oauth_service_id:string, oauth_user_entry_id:string) {
    let result:string|any
    await new RevokeToken({ oauth_service_id, oauth_user_entry_id }).run(async (e, revoke_result) => {
      if(e) {
        /**
         * Do nothing when an error occurs. SHOULD be an error related with revoking a token that is already
         * revoked on the outside service or something.
         */
        console.log(`Error was caught while revoking but ignoring. Will delete its entry anyways.`)
        revoke_result = "Error while revoking the token."
      }
      result = revoke_result
    })
    return result
  }
}

async function iterateConnectedAccounts(user_id:string, cb:(connected_account:any) => Promise<void>) {
  const connected_accounts = await oauth_connected_user_storage.getAllEntriesForUserId(user_id)

  await Promise.all(
    connected_accounts.map(async connected_account => {
      return await cb(connected_account)
    })
  )
}

async function iterateServiceSettings(user_id:string, cb:(service_setting:any, service_info:ServiceInfo) => Promise<void>) {
  const service_settings = await service_setting_storage.getAllServiceSettingsForUserId(user_id)
  
  await Promise.all(
    service_settings.map(async service_setting => {
      const service_id = service_setting.get("service_id")
      const service_info = getServiceInfo(service_id)

      return await cb(service_setting, service_info)
    })
  )
}