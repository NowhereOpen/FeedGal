import { ServiceInfoBase } from "~/src/gyst/server/base-class/service-module/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "gyst",
      is_oauth: false,
      name: "Gyst"
    })
  }
}