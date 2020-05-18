import { RefreshTokenIfFailTask as _RefreshTokenIfFailTask, OAuthBaseClass } from "gyst-cred-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"
import { OAuthBaseLoaderModule } from "~/src/server/loader-module-collection/loader-module-base/oauth"

import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { getServiceInfo } from "../loader-module-collection"

export type TaskCb = (token_response:any) => Promise<any>

/**
 * 
 * @param service_id Use service_id instead of oauth_service_id
 * @param oauth_connected_user_entry_id 
 * @param cb 
 */
export async function refreshTokenIfFail(service_id:string, oauth_connected_user_entry_id:string, cb:TaskCb) {
  const service_info = getServiceInfo(service_id)
  const oauth_service_id = service_info.oauth_service_id!
  const cred_module = cred_module_collection[oauth_service_id]
  const task = new RefreshTokenIfFailTask(cred_module, cb, oauth_service_id, oauth_connected_user_entry_id)

  await task.useToken()
}

/**
 * 2020-05-14 09:50
 * 
 * SHOULD be used for method-collection only. The parameters feel like they are everywhere. For 
 * example, it feels like I could set loader and cred_module within this class because they can
 * all be retreieved from `this.service_id`.
 * 
 * Using this class in other use cases may require updating the parameters which can get ugly.
 */
class RefreshTokenIfFailTask extends _RefreshTokenIfFailTask {
  task:TaskCb
  oauth_service_id:string
  oauth_connected_user_entry_id:string

  constructor(cred_module:OAuthBaseClass, task:TaskCb, oauth_service_id:string, oauth_connected_user_entry_id:string) {
    super(cred_module)
    this.task = task
    this.oauth_service_id = oauth_service_id
    this.oauth_connected_user_entry_id = oauth_connected_user_entry_id
  }

  async doTask(token_data:any) {
    return await this.task(token_data)
  }

  async getTokenData() {
    const token_data = await oauth_access_token_storage.getTokenData(
      this.oauth_service_id,
      this.oauth_connected_user_entry_id
    )
    return token_data
  }

  async onRefreshToken(refresh_token_response:any) {
    await oauth_access_token_storage.refreshAccessToken(
      this.oauth_service_id,
      this.oauth_connected_user_entry_id,
      refresh_token_response
    )
  }
}