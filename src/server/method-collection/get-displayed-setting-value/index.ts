import { collection } from "../common/services"

const service_ids = ["github","google-calendar","league-of-legends"]

export function getDisplayedSettingValue(service_id:string, setting_value:any) {
  return collection[service_id].getDisplayedSettingValue!(setting_value)
}