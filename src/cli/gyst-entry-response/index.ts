import {
  GystEntryResponseGeneralError,
  GystEntryResponse,
} from "~/src/common/types/pages/main"

export function isGeneralError(response:GystEntryResponseGeneralError|GystEntryResponse) {
  return "error" in response && ["service_setting_id", "setting_value_id"].every(field => field in response == false)
}

export function isError(response:GystEntryResponse) {
  return "error" in response
}