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
}

import {
  GystEntryWarning,
  GystEntryError,
  GystEntryResponseErrorDetails,
  LoadEntryParamDetail
} from "~/src/common/types/gyst-entry"

export function commonErrorDetailGenerator(e:Error, known_errors:GystEntryError[]=[]) {
  const is_known_error = ["DEV_FAULT_MSG", "DEV_FAULT", ...known_errors].includes(e.name)
  let error_detail:GystEntryResponseErrorDetails
  if(is_known_error) {
    if(e.name == "DEV_FAULT") {
      error_detail = {
        name: "DEV_FAULT",
        message: "The developer did something wrong.",
        data: {
          error: {
            name: e.name,
            message: e.message
          }
        }
      }
    }
    else {
      /**
       * 2020-03-21 22:39
       * `response.error = e` doesn't set `response.error.message`
       * when `e` is an error created with `new Error("Some message")`
       * for some reason. So have to assign each property individually.
       */
      error_detail = {
        name: <GystEntryError> e.name,
        message: e.message,
        // Can be undefined
        data: (<any> e).data
      }
    }
  }
  else {
    throw e
  }

  return error_detail
}

import { LoaderModuleOutput, PaginationData } from "../loader-module-collection/loader-module-base/types"

export type handleErrorParam = {
  service_id:string
  pagination_options?: PaginationData
}

export async function handleError(
  { service_id, pagination_options }:handleErrorParam,
  cb:() => Promise<LoaderModuleOutput>
):Promise<GystEntryWarning|undefined> {
  try {
    const output:LoaderModuleOutput = await cb()
  }
  catch(e) {
    if(service_id == "league-of-legends") {
      if("response" in e ) {
        const status = e.response.status
        if(status == 403) {
          throw <GystEntryResponseErrorDetails> {
            data: "",
            message: "The server admin forgot to refresh the Riot API KEY 🤦.",
            name: "DEV_FAULT_MSG"
          }
        }
        else if(status == 429) {
          return {
            name: "RATE_LIMIT",
            message: "",
            data: ""
          }
        }
        else {
          throw e
        }
      }
    }

    throw e
  }
}