import {
  ContentServiceBase,
} from "~/src/gyst/server/base-class/service-module/content-service"
import { ServiceInfo } from "./service-info"
import { formatEntries } from "./format-entries"
import { getCredential } from "./get-credential"
import { GetLoLServiceResponse } from "./get-service-response"

export class ContentService extends ContentServiceBase {
  getServiceInfo() {
    return new ServiceInfo().getServiceInfo()
  }

  getCredentials() {
    return getCredential()
  }

  async getServiceResponse():Promise<any> {
    const pagination_req_data = this.getServiceResponseParams()
    try {
      const task = new GetLoLServiceResponse(this.credentials, this.setting_value, pagination_req_data)
      return await task.run()
    }
    catch(e) {
      if("response" in e && e.response.status == 404) {
        const error = new Error("Summoner doesn't exist.")
        error.name = "INVALID_SETTING_VALUE"
        Object.assign(error, {
          data: {
            raw_error: e,
            setting_value: this.setting_value
          }
        })

        throw error
      }

      throw e
    }
  }

  formatToGystEntries(service_response:any) {
    return service_response.map(formatEntries)
  }

  getPaginationOption(service_response:any) {
    return {
      new: null, old: null
    }
  }
}