import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import {
  getServiceInfo,
  validateSettingValueNonOAuth,
  validateSettingValueOAuth
} from "~/src/server/loader-module-collection"

import { ValidationResult } from "~/src/server/loader-module-collection/loader-module-base/types"

import { refreshTokenIfFail } from "../common"

export async function validateSettingValue(service_setting_id:string, setting_value:any) {
  const _entry = await service_setting_storage.getEntry(service_setting_id)
  const entry = _entry!.toJSON()
  const { service_id, oauth_connected_user_entry_id } = entry

  const is_oauth = getServiceInfo(service_id).is_oauth

  let result!:ValidationResult

  if(is_oauth) {
    try {
      const token_data = await oauth_access_token_storage.getTokenData(service_id, oauth_connected_user_entry_id)
      await refreshTokenIfFail(service_id, token_data, async () => {
        result = await validateSettingValueOAuth(service_id, token_data, setting_value)
      })
    }
    catch(e) {
      console.log(e)
      throw e
    }
  }
  else {
    result = await validateSettingValueNonOAuth(service_id, setting_value)
  }

  return result
}