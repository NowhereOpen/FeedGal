import { ServiceInfoBase } from "../../../loader-module-base/service-info"

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