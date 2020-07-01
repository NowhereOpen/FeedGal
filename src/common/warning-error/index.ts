import { Warning, WarningName, Error, ErrorName } from "~/src/common/types/common/warning-error"

export const GOOGLE_AUTHORIZATION_ERROR:Error = {
  name: "GOOGLE_AUTHORIZATION_ERROR",
  message: "Authorization to this service wasn't granted when you connected the account"
}

export const RIOT_API_ERROR:Error = {
  name: "RIOT_KEY_EXPIRED",
  message: "The server admin forgot to refresh the Riot API KEY 🤦.",
}

export const RATE_LIMIT:Warning = {
  name: "RATE_LIMIT",
  message: `'Rate limit' occurred for this service. May eventually load.`
}

export const ALL_LOADED:Warning = {
  name: "ALL_LOADED",
  message: "All entries have been loaded."
}

export const INVALID_SETTING_VALUE:Error = {
  name: "INVALID_SETTING_VALUE",
  message: "Please update your setting.",
}

export const TOKEN_MARKED_ERROR:Error = {
  name: "TOKEN_MARKED_ERROR",
  message: "Please reconnect your service account.",
}