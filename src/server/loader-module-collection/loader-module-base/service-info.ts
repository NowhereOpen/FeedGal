import * as _ from "lodash"
import { ServiceInfo } from "./types"

export type GetUserPageFn = (user_info:any) => string

export type ServiceInfoParam = {
  service_id:string
  name:string
  is_oauth:boolean
  oauth_service_id?:string|null
  uses_setting_value?:boolean
}

/**
 * 2020-05-09 17:58 
 * 
 * Use this class because it helps with filling other fields that possibly use the 
 * same value as other fields. For example, reddit will use `reddit` as its `oauth_service_id`.
 * YouTube and Google Calendar are the only services that use a value that's different from its
 * service_id. They both use `google`.
 * 
 * This class SHOULD KNOW that it's used within the context of GYST application. So, if details
 * need to be updated, please don't drag this in and make things complicated.
 */
export class ServiceInfoBase {
  service_info:ServiceInfo

  constructor(service_info:ServiceInfoParam) {
    const uses_setting_value = _.get(service_info, "uses_setting_value", false)
    const oauth_service_id = _.get(service_info, "oauth_service_id", null)

    this.service_info = {
      service_id: service_info.service_id,
      name: service_info.name,
      is_oauth: service_info.is_oauth,
      oauth_service_id,
      uses_setting_value
    }

    if(this.service_info.is_oauth === true && this.service_info.oauth_service_id == null) {
      this.service_info.oauth_service_id = this.service_info.service_id
    }
  }

  getServiceInfo() {
    return this.service_info
  }
}