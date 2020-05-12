import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"

import { ServiceInfo } from "~/src/server/loader-module-collection/loader-module-base/types"
import { getServiceInfo } from "~/src/server/loader-module-collection"
import { getServiceSetting } from "~/src/server/gyst-server/common/gyst-suite"

export class PostCreateNewServiceSettingRequestHandler extends SessionRequestHandlerBase {
  service_id!:string
  oauth_connected_user_id!:string
  alias:string|undefined
  service_info!:ServiceInfo

  storeParams():void|Promise<void> {

    this.service_id = this.req.body.service_id
    this.oauth_connected_user_id = this.req.body.oauth_connected_user_id
    this.alias = this.req.body.alias
    this.service_info = getServiceInfo(this.service_id)
  }

  async doTasks():Promise<void> {
    if(this.service_info.is_oauth && this.oauth_connected_user_id == null) {
      return this.sendError(
        400,
        "OAUTH_CONNECTED_USER_NOT_EXIST",
        "You must create a service setting with an associated oauth account.",
        { oauth_connected_user_id: this.oauth_connected_user_id }
      )
    }

    const result = await service_setting_storage.createNewServiceSetting(this.user_id!, this.service_id, this.oauth_connected_user_id, this.alias)
    this.res_data.service_setting = await getServiceSetting(result._id)
  }
}