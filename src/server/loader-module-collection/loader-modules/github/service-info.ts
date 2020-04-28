import { ServiceInfoBase } from "~/src/gyst/server/base-class/service-module/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "github",
      is_oauth: true,
      name: "Github",
      uses_setting_value: true
    })
  }
}