import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"

export class GetToggleServiceSettingRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
  }

  async doTasks():Promise<void> {
    const oauth_connected_user_entry_id:string = await service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
    const result = await service_setting_storage.toggleServiceDisabled(this.service_setting_id)
    const entry = await service_setting_storage.getEntry(this.service_setting_id)
    const updated_value = entry!.get("is_disabled")

    this.res_data = {
      result: updated_value
    }
  }
}