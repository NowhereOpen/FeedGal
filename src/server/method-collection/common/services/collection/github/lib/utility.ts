import { GithubSettingValue as SettingValue } from "~/src/common/types/common/setting-value"

export function getOwnerFromSettingValue(setting_value:SettingValue) {
  return setting_value.is_mine ? setting_value.user_id : setting_value.owner
}