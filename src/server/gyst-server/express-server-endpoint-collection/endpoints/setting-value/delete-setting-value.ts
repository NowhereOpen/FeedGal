import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

export class DeleteSettingValueRequestHandler extends SessionRequestHandlerBase {
  setting_value_id!:string

  storeParams():void|Promise<void> {
    this.setting_value_id = this.req.params.setting_value_id
  }

  async doTasks():Promise<void> {
    const result = await setting_value_storage.deleteSettingValue(this.setting_value_id)
    this.res_data.delete_result = result
  }

  // getResponse():any|Promise<any> {}
}