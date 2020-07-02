import { RefreshTokenIfFailTask as _RefreshTokenIfFailTask, OAuthBaseClass, ErrorBeforeRefreshing } from "oauth-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"
import { isTokenError } from "~/src/server/lib/oauth-cred-module-helper"

import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { collection } from "./services"

export type TaskCb = (token_response:any) => Promise<any>

/**
 * 
 * @param service_id Use service_id instead of oauth_service_id
 * @param oauth_connected_user_entry_id 
 * @param cb 
 */
export async function refreshTokenIfFail(service_id:string, oauth_connected_user_entry_id:string, cb:TaskCb) {
  const service_info = collection[service_id].getServiceInfo()
  const oauth_service_id = service_info.oauth_service_id!
  await refreshTokenIfFailOAuthServiceId(oauth_service_id, oauth_connected_user_entry_id, cb)
}

export async function refreshTokenIfFailOAuthServiceId(oauth_service_id:string, oauth_connected_user_entry_id:string, cb:TaskCb) {
  const cred_module = cred_module_collection[oauth_service_id]
  const task = new RefreshTokenIfFailTask(cred_module, cb, oauth_service_id, oauth_connected_user_entry_id)

  try {
    await task.useToken()
  }
  catch(e) {
    if(e instanceof ErrorBeforeRefreshing) {
      throw e.original_error
    }
    throw e
  }
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

  /**
   * @param refresh_token_response 2020-05-19 01:33 Axios response. The returned value of cred module refresh token
   */
  async onRefreshToken(refresh_token_response:any, token_data:any) {
    let updated_token_data = refresh_token_response
    if(["google", "reddit", "twitch"].includes(this.oauth_service_id)) {
      const { data } = refresh_token_response
      updated_token_data = Object.assign(token_data, data)
    }
    
    await oauth_access_token_storage.refreshAccessToken(
      this.oauth_service_id,
      this.oauth_connected_user_entry_id,
      updated_token_data
    )
  }

  /**
   * Prevent from refreshing token when the error is not related to token error.
   */
  isThrowOnFirstTry(e:Error) {
    /**
     * 2020-06-18 08:00 
     * 
     * Instead of checking if it's a SettingValueError or other types, check if it's a 
     * token error. If it's not the error detail (whether setting value error, etc)
     * should be handled outside of this `refreshTokenIfFail`.
     */

    /**
     * Throw error if it's not a token error. If token error, return false so that it
     * doesn't throw on first try
     */
    return isTokenError(this.oauth_service_id, e) == false
  }
}