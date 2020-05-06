import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { getServiceSettingsForGystSuiteId } from "~/src/common-request-handling-tasks/gyst-suite"

export class GetServiceSettingsForGystSuiteRequestHandler extends SessionRequestHandlerBase {
  gyst_suite_id!:string

  storeParams():void|Promise<void> {
    this.gyst_suite_id = this.req.params.gyst_suite_id
  }

  async doTasks():Promise<void> {
    this.res_data.service_settings = await getServiceSettingsForGystSuiteId(this.gyst_suite_id)
  }

  // getResponse():any|Promise<any> {}
}