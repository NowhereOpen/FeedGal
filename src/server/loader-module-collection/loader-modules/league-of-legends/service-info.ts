import { ServiceInfoBase } from "~/src/gyst/server/base-class/service-module/service-info"

export class ServiceInfo extends ServiceInfoBase {
  constructor() {
    super({
      service_id: "league-of-legends",
      is_oauth: false,
      name: "League of Legends",
      uses_setting_value: true
    })
  }
}