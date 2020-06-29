import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { Entry } from "./loader"
import { LoadStatus } from "./load-status"

export * from "./load-status"
export * from "./loader"
export * from "~/src/common/types/common/load-entry-param"

export type GystEntryWrapper = {
  entry:Entry
  load_entry_param_detail:LoadEntryParamDetail
}
export type LoadedEntries = GystEntryWrapper[]

export type State = {
  loaded_entries: LoadedEntries
  load_status: LoadStatus
}