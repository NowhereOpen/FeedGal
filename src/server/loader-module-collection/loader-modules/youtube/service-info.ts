import { ServiceInfoBase } from "~/src/gyst/server/base-class/service-module/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "youtube",
      is_oauth: true,
      name: "YouTube",
      oauth_service_id: "google"
    })
  }
}