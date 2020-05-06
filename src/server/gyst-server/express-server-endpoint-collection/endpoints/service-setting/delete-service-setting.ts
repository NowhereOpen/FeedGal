import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"

export class DeleteServiceSettingRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
  }

  async doTasks():Promise<void> {
    await service_setting_storage.deleteServiceSetting(this.service_setting_id)
  }

  // getResponse():any|Promise<any> {}
}