import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import {
  collection
} from "../common/services"

import { ValidationResult } from "../common/services/base/types"

import { refreshTokenIfFail } from "../common/refresh-token-if-fail"

export async function validateSettingValue(service_setting_id:string, setting_value:any) {
  const _entry = await service_setting_storage.getEntry(service_setting_id)
  const entry = _entry!.toJSON()
  const { service_id, oauth_connected_user_entry_id } = entry

  const is_oauth = collection[service_id].getServiceInfo().is_oauth

  let result!:ValidationResult

  /**
   * 2020-06-19 10:31
   * 
   * Not setting error or invalidating oauth account or setting value from this file because
   * I expect this is when the user visits the page, currently in the server-side-data-injection
   * file for `/suite`.
   */
  if(is_oauth) {
    await refreshTokenIfFail(service_id, oauth_connected_user_entry_id, async (token_data) => {
      result = await validateSettingValueOAuth(service_id, token_data, setting_value)
    })
  }
  else {
    result = await validateSettingValueNonOAuth(service_id, setting_value)
  }

  return result
}