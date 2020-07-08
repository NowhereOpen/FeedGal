import { WarningObject, WarningName, ErrorObject, ErrorName } from "~/src/common/types/common/warning-error"

export const GOOGLE_AUTHORIZATION_ERROR = () => <ErrorObject> {
  name: "GOOGLE_AUTHORIZATION_ERROR",
  message: "Authorization to this service wasn't granted when you connected the account"
}

export const RIOT_KEY_EXPIRED_ERROR = () => <ErrorObject> {
  name: "RIOT_KEY_EXPIRED",
  message: "The server admin forgot to refresh the Riot API KEY 🤦.",
}

export const RATE_LIMIT = () => <WarningObject> {
  name: "RATE_LIMIT",
  message: `'Rate limit' occurred for this service. May eventually load.`
}

export const ALL_LOADED = () => <WarningObject> {
  name: "ALL_LOADED",
  message: "All entries have been loaded."
}

export const NO_SETTING_VALUES = () => <WarningObject> {
  name: "NO_SETTING_VALUES",
  message: "Please add setting values to get feeds."
}

export const INVALID_SETTING_VALUE = () => <ErrorObject> {
  name: "INVALID_SETTING_VALUE",
  message: "Please update your setting.",
}

export const TOKEN_MARKED_ERROR = () => <ErrorObject> {
  name: "TOKEN_MARKED_ERROR",
  message: "Please reconnect your service account.",
}

export const MUST_BE_ANON_USER = (message:string = "You must be logged out.") => <ErrorObject> {
  name: "MUST_BE_ANON_USER",
  message
}

export const MUST_BE_LOGGED_IN = (message:string = "You must be logged in.") => <ErrorObject> {
  name: "MUST_BE_LOGGED_IN",
  message
}

export const BAD_SIGNUP_FORM = (message:string) => <ErrorObject> {
  name: "BAD_SIGNUP_FORM",
  message
}