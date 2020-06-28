import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { validateSettingValue } from "~/src/server/method-collection/validate-setting-value"

// Models
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

// Types
import { OAuthUserInfo } from "~/src/common/types/common/suite"

export class PatchUpdateOAuthAccountRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string
  new_oauth_connected_user_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
    this.new_oauth_connected_user_id = this.req.body.new_oauth_connected_user_id
  }

  async doTasks():Promise<void> {
    const invalid_setting_values = await this.getInvalidSettingValues()

    if(invalid_setting_values.length > 0) {
      return this.sendError(
        400,
        "INVALID_NEW_OAUTH_ACCOUNT",
        "The new account doesn't work with all setting values.",
        { invalid_setting_values }
      )
    }

    await service_setting_storage.updateOAuthConnectedUser(this.service_setting_id, this.new_oauth_connected_user_id)

    const entry = await oauth_connected_user_storage.getEntry(this.new_oauth_connected_user_id)

    const new_oauth_connected_user:OAuthUserInfo = {
      entry_id: entry!._id,
      user_id: entry!.get("service_user_id"),
      friendly_name: entry!.get("friendly_name"),
      user_uid: entry!.get("user_uid"),
    }
    this.res_data = { entry, new_oauth_connected_user }
  }

  async getInvalidSettingValues():Promise<any[]> {
    const setting_values = await setting_value_storage.getAllSettingValues(this.service_setting_id)
    const service_id = await service_setting_storage.getServiceId(this.service_setting_id)

    const invalid_setting_values:any[] = []

    await Promise.all(
      setting_values.map(async entry => {
        const setting_value = entry!.get("value")
        const validation_result = await validateSettingValue(this.service_setting_id, setting_value)

        if(validation_result.is_valid == false) {
          invalid_setting_values.push(setting_value)
        }
      })
    )

    return invalid_setting_values
  }
}