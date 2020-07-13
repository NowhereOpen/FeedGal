import { ServiceInfoBase } from "../../../base/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "rss",
      name: "RSS",
      is_oauth: false,
      uses_setting_value: true
    })
  }
}