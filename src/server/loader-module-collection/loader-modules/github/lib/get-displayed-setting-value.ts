import { SettingValue } from "./type"

export function getDisplayedSettingvalue(setting_value:SettingValue) {
  const owner = setting_value.is_mine ? setting_value.user_id : setting_value.owner
  return owner + "/" + setting_value.repo
}