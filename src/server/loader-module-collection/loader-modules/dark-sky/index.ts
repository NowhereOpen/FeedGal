import {
  ContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export class ContentService extends ContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  getCredentials() {
    return service_credentials_reader.getApiKey("dark-sky")
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