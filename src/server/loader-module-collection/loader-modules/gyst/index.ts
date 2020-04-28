import {
  ContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { gyst_post_storage } from "~/src/models/gyst-post"

export class ContentService extends ContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  getCredentials() {
    return 
  }

  async getServiceResponse():Promise<any> {
    return {}
  }

  formatToGystEntries(service_response:any) {
    return []
  }

  getPaginationOption(service_response:any) {
    return {
      new: null, old: null
    }
  }
}