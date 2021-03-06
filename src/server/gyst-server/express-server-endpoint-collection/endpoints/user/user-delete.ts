import { RemoveDataBase } from "./common/remove-data"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Methods
import { RevokeToken, iterateServiceSettings } from "~/src/server/method-collection"

export class DeleteUserRequestHandler extends RemoveDataBase<
  { revoke_results: any[] },
  { setting_values_result: any[], service_settings_result: any },
  { oauth_connected_user_result: any }
> {
  storeParams():void|Promise<void> {}

  async handleAccessToken0() {
    const revoke_results:any[] = []

    await iterateConnectedAccounts(this.user_id!, async (connected_account) => {
      const oauth_service_id = connected_account.get("service_id")
      const oauth_user_entry_id = connected_account._id
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
      revoke_results.push({ oauth_service_id, oauth_user_entry_id, result })
      await oauth_access_token_storage.deleteEntry(oauth_service_id, oauth_user_entry_id)
    })

    return { revoke_results }
  }

  async handleServiceSetting1() {
    const setting_values_result:any[] = []
    await iterateServiceSettings(this.user_id!, async ({ service_info, service_setting }) => {
      if(service_info!.uses_setting_value) {
        const service_id = service_setting!.service_id
        const service_setting_id = service_setting!._id
        const result = await setting_value_storage.clearServiceSettingSettingValueValues(service_setting_id)
        setting_values_result.push({
          service_id,
          service_setting_id,
          result
        })
      }
    })

    const service_settings_result = await service_setting_storage.deleteUser(this.user_id!)

    return { setting_values_result, service_settings_result }
  }

  async handleConnectedAccount2() {
    const oauth_connected_user_result = await oauth_connected_user_storage.deleteUser(this.user_id!)
    return { oauth_connected_user_result }
  }

  async doTasks():Promise<void> {
    const result = await this.removeData()
    
    const remove_user_result = await gyst_user_storage.deleteUser(this.user_id!)

    this.res_data = { remove_user_result, remove_data_result: result }

    this.logout()
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