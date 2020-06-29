export type GystEntryWarningTypes = "RATE_LIMIT" | "ALL_LOADED" | "DISABLED"

export type GystEntryWarning = {
  name?: GystEntryWarningTypes
  message: string
  data: any
}