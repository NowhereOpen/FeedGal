import { type } from "cypress/types/jquery"

export type WarningName = "NO_SETTING_VALUES" | "NO_SERVICE_SETTINGS" | "RATE_LIMIT" | "ALL_LOADED"

export type ErrorName = "INVALID_SETTING_VALUE" | "TOKEN_MARKED_ERROR" | "GOOGLE_AUTHORIZATION_ERROR" | "RIOT_KEY_EXPIRED"

export type Warning = {
  name: WarningName
  message?: string
}

export type Error = {
  name: ErrorName
  message?: string
}