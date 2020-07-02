import { collection } from "../common/services"

export function isSettingValueError(service_id:string, e:any) {
  return collection[service_id].isSettingValueError!(e)
}