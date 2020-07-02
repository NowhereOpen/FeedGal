import { collection } from "../common/services"

export function getServiceInfo(service_id:string) {
  return collection[service_id].getServiceInfo()
}