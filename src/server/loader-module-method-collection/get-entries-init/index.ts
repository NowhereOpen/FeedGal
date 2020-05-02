import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { forAllSettingValuesInServiceSettings } from "./lib"

export async function getEntriesInit(
  user_id:string,
  cb:(data:any) => Promise<void>
) {
  const service_settings = await service_setting_storage.getEnabledServiceSettingsForUserId(user_id)

  if(service_settings.length == 0) {

  }
  else {    
    await forAllSettingValuesInServiceSettings(service_settings, async (data:any) => {

    })
  }
}