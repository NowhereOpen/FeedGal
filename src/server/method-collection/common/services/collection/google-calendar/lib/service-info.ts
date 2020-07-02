import { ServiceInfoBase } from "../../../base/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "google-calendar",
      is_oauth: true,
      name: "Google Calendar",
      oauth_service_id: "google",
      uses_setting_value: true
    })
  }
}