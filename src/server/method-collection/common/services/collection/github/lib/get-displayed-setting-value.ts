import { SettingValue } from "./type"
import { getOwnerFromSettingValue } from "./utility"

export function getDisplayedSettingValue(setting_value:SettingValue) {
  const owner = getOwnerFromSettingValue(setting_value)
  return owner + "/" + setting_value.repo
}