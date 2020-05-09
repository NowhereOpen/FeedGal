import { ServiceInfoBase } from "../../../loader-module-base/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "twitch",
      is_oauth: true,
      name: "Twitch"
    })
  }
}