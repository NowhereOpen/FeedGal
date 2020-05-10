import { getServiceInfo, validateSettingValue as _validateSettingValue, ValidateSettingValueParam } from "~/src/server/loader-module-collection"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

export async function validateSettingValue(service_setting_id:string, setting_value:any) {
  const _entry = await service_setting_storage.getEntry(service_setting_id)
  const entry = _entry!.toJSON()
  const { service_id, oauth_connected_user_entry_id } = entry

  const is_oauth = getServiceInfo(service_id).is_oauth
  const param:ValidateSettingValueParam = {
    service_id, setting_value
  }

  if(is_oauth) {
    const token_data = await oauth_access_token_storage.getTokenData(service_id, oauth_connected_user_entry_id)
    param.token_data = token_data
  }

  await _validateSettingValue(param)
}