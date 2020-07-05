import { Entry } from "./loader"
import { LoadStatus } from "./load-status"
import { SuiteEntry } from "~/src/common/types/common/suite"

export * from "./load-status"
export * from "./loader"
export { SuiteEntry } from "~/src/common/types/common/suite"

export type GystEntryWrapper = {
  entry:Entry
  suite_entry:SuiteEntry
}
export type LoadedEntries = GystEntryWrapper[]

export type State = {
  loaded_entries: LoadedEntries
  load_status: LoadStatus
}