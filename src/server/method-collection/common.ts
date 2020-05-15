import { RefreshTokenIfFailTask as _RefreshTokenIfFailTask, OAuthBaseClass } from "gyst-cred-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"
import { OAuthBaseLoaderModule } from "~/src/server/loader-module-collection/loader-module-base/oauth"

import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

import { loader_collection } from "~/src/server/loader-module-collection/collection"

export type TaskCb = (token_response:any) => Promise<any>

export async function refreshTokenIfFail(service_id:string, oauth_connected_user_entry_id:string, cb:TaskCb) {
  let loader = loader_collection[service_id]
  const service_info = loader.service_info

  loader = <OAuthBaseLoaderModule>loader
  const cred_module = cred_module_collection[<string>service_info.oauth_service_id]
  const task = new RefreshTokenIfFailTask(cred_module, cb, service_id, oauth_connected_user_entry_id)

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
  service_id:string
  oauth_connected_user_entry_id:string

  constructor(cred_module:OAuthBaseClass, task:TaskCb, service_id:string, oauth_connected_user_entry_id:string) {
    super(cred_module)
    this.task = task
    this.service_id = service_id
    this.oauth_connected_user_entry_id = oauth_connected_user_entry_id
  }

  async doTask(token_data:any) {
    return await this.task(token_data)
  }

  async getTokenData() {
    const token_data = await oauth_access_token_storage.getTokenData(
      this.service_id,
      this.oauth_connected_user_entry_id
    )
    return token_data
  }

  async onRefreshToken(refresh_token_response:any) {
    oauth_access_token_storage.refreshAccessToken(
      this.service_id,
      this.oauth_connected_user_entry_id,
      refresh_token_response
    )
  }
}