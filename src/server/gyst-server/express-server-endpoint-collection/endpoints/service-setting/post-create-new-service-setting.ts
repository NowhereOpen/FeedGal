import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { getServiceInfo } from "~/src/server/loader-module-collection"
import { getServiceSetting } from "~/src/server/gyst-server/common/gyst-suite"

// Models
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"

// Types
import { ServiceInfo } from "~/src/server/loader-module-collection/loader-module-base/types"

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
    const result = await service_setting_storage.createNewServiceSetting(this.user_id!, this.service_id, this.oauth_connected_user_id, this.alias)
    this.res_data.service_setting = await getServiceSetting(result._id)
  }
}