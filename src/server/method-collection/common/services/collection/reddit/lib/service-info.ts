import { ServiceInfoBase } from "../../../base/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "reddit",
      is_oauth: true,
      name: "Reddit"
    })
  }
}