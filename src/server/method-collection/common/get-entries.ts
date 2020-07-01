import _ from "lodash"
import { ErrorOnRefreshRequest } from "oauth-module-suite"

import {
  GystEntryWarning,
  GystEntryResponseErrorDetails,
  LoadEntryParamDetail
} from "~/src/common/types/pages/main"
import { LoaderModuleOutput, ServiceInfo } from "~/src/server/loader-module-collection/loader-module-base/types"

import { getServiceInfo } from "~/src/server/loader-module-collection"
import { isTokenError as _isTokenError } from "~/src/server/lib/oauth-cred-module-helper"
import { isSettingValueError as _isSettingValueError } from "~/src/server/loader-module-collection/is-setting-value-error"

import { GOOGLE_AUTHORIZATION_ERROR, RIOT_API_ERROR } from "~/src/common/warning-error"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

/**
 * 2020-06-18 17:28 
 * 
 * The thrown error ARE actually javascript Error compatible because they have `name` and `message`
 * properties
 */
export async function handleError(
  detail:LoadEntryParamDetail,
  cb:() => Promise<LoaderModuleOutput>
):Promise<GystEntryWarning|undefined> {
  const { service_id, setting_value_id, service_setting_id, oauth_connected_user_entry_id } = detail
  
  await throwControlledError(detail)

  try {
    const output:LoaderModuleOutput = await cb()
    /**
     * 2020-06-28 00:51
     * In case of Twitch, could refresh the thumbnail and see if there exists any new streams that
     * started or ended but using `ALL_LOADED` for now.
     */
    if(["github", "trello", "twitch"].includes(service_id)) {
      if(output.entries.length == 0) {
        return {
          name: "ALL_LOADED",
          message: "All entries have been loaded.",
          data: ""
        }
      }
    }
  }
  catch(e) {
    const service_info = getServiceInfo(service_id)
    const is_token_error = isTokenError(service_info, e)
    const is_setting_value_error = isSettingValueError(service_info, e)

    if(is_token_error) {
      await oauth_connected_user_storage.setError(oauth_connected_user_entry_id!, true)

      throw makeTokenError()
    }
    else if(is_setting_value_error) {
      await setting_value_storage.invalidateSettingValue(setting_value_id!)

      throw makeSettingValueError()
    }
    else {
      if("response" in e ) {
        const status = e.response.status
        
        if(service_id == "league-of-legends") {
          if(status == 403) {
            throw <GystEntryResponseErrorDetails> RIOT_API_ERROR
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
        else if(service_info.oauth_service_id == "google") {
          /**
           * 2020-06-29 22:10
           * 
           * Note. There are many 403 errors. But all errors regarding granting access has
           * `e.response.data.error.status == PERMISSION_DENIED`
           */
          if(status == 403 && _.get(e, "response.data.error.status") == "PERMISSION_DENIED") {
            throw <GystEntryResponseErrorDetails> GOOGLE_AUTHORIZATION_ERROR
          }
        }
      }
    }

    throw e
  }
}

async function throwControlledError({ service_id, oauth_connected_user_entry_id, setting_value_id }:LoadEntryParamDetail) {
  if(oauth_connected_user_entry_id) {
    const is_error = await oauth_connected_user_storage.isErrorWithUserUid(service_id, oauth_connected_user_entry_id)
    if(is_error) {
      throw makeTokenError()
    }
  }
  
  if(setting_value_id) {
    const is_invalid = await setting_value_storage.isInvalid(setting_value_id)
    if(is_invalid) {
      throw makeSettingValueError()
    }
  }
}

function makeTokenError():GystEntryResponseErrorDetails {
  return {
    data: "",
    message: "Please reconnect your service account.",
    name: "TOKEN_MARKED_ERROR"
  }
}

function makeSettingValueError():GystEntryResponseErrorDetails {
  return {
    data: "",
    message: "Please update your setting.",
    name: "INVALID_SETTING_VALUE"
  }
}

function isTokenError(service_info:ServiceInfo, e:Error):boolean {  
  /**
   * If it's a token error, it must have gone through `refreshTokenifFail` which throws an 
   * error that wraps the original error in `original_error`.
   */
  if("original_error" in e == false || service_info.is_oauth == false) return false

  /**
   * Error while refreshing token definitely has a problem with tokens.
   */
  if(e instanceof ErrorOnRefreshRequest) return true

  const service_id = service_info.oauth_service_id!
  return _isTokenError(service_id, (<any> e).original_error)
}

function isSettingValueError(service_info:ServiceInfo, e:Error):boolean {  
  if(service_info.uses_setting_value == false) return false

  const service_id = service_info.service_id
  return _isSettingValueError(service_id, e)
}