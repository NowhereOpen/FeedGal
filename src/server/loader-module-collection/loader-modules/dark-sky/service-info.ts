import { ServiceInfoBase } from "~/src/gyst/server/base-class/service-module/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "dark-sky",
      is_oauth: false,
      name: "Dark Sky",
      oauth_service_id: null,
      uses_setting_value: true
    })
  }
}